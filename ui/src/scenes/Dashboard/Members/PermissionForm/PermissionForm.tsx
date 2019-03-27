import { Formik, FormikActions, FormikProps } from 'formik'
import { useObserver } from 'mobx-react-lite'
import React, { FunctionComponent, useState } from 'react'
import * as yup from 'yup'
import { useAuth } from '../../../../app'
import { allPermissions, Permission, User } from '../../../../auth'
import { showErrorToast, showSuccessToast } from '../../../../common'
import { TwoRowLoading } from '../../../../components/TwoRowLoading'
import { PermissionFormView } from './PermissionFormView'

export interface PermissionFormValue {
  permissions: Permission[]
}

export interface PermissionFormProps {
  user: User
}

export const PermissionForm: FunctionComponent<PermissionFormProps> = ({ user }) => {
  const availablePermissions = [...allPermissions]
  const authStore = useAuth()
  const [currentPermissions, setCurrentPermissions] = useState(user.permissions)

  const validationSchema = yup.object().shape({
    permissions: yup
      .array()
      .label('Permissions')
      .of(yup.string().oneOf(availablePermissions)),
  })

  const handleSubmit = async (values: PermissionFormValue, { setSubmitting }: FormikActions<PermissionFormValue>) => {
    try {
      const newPermissions = await authStore.updateUserPermission(user.id, values.permissions)
      setCurrentPermissions(newPermissions)
      showSuccessToast(`User's Permission Updated`)
    } catch (error) {
      showErrorToast(error)
    } finally {
      setSubmitting(false)
    }
  }

  return useObserver(() => {
    const initialValue: PermissionFormValue = {
      permissions: currentPermissions,
    }

    const updatablePermissions = authStore.me ? authStore.me.permissions : []
    if (!availablePermissions || !updatablePermissions) return <TwoRowLoading />

    const renderView = (props: FormikProps<PermissionFormValue>) => (
      <PermissionFormView
        availablePermissions={availablePermissions}
        updatablePermissions={updatablePermissions}
        {...props}
      />
    )

    return (
      <Formik
        initialValues={initialValue}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        render={renderView}
      />
    )
  })
}
