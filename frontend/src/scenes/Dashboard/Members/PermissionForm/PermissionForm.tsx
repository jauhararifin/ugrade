import { Formik, FormikActions, FormikProps } from 'formik'
import React, { FunctionComponent, useState } from 'react'
import { useMyPermissions, useUpdateUserPermissions } from 'ugrade/auth'
import { allPermissions, User, UserPermission } from 'ugrade/auth/store'
import { globalErrorCatcher, handleCommonError } from 'ugrade/common'
import { TopToaster } from 'ugrade/common/ActionToaster'
import { TwoRowLoading } from 'ugrade/components/TwoRowLoading'
import * as yup from 'yup'
import { PermissionFormView } from './PermissionFormView'

export interface PermissionFormValue {
  permissions: UserPermission[]
}

export interface PermissionFormProps {
  user: User
}

export const PermissionForm: FunctionComponent<PermissionFormProps> = ({
  user,
}) => {
  const availablePermissions = [...allPermissions]
  const updatablePermissions = useMyPermissions()
  const [currentPermissions, setCurrentPermissions] = useState(user.permissions)
  const updateUserPermissions = useUpdateUserPermissions()

  if (!availablePermissions || !updatablePermissions) return <TwoRowLoading />

  const initialValue: PermissionFormValue = {
    permissions: currentPermissions,
  }

  const validationSchema = yup.object().shape({
    permissions: yup
      .array()
      .label('Permissions')
      .of(yup.string().oneOf(availablePermissions)),
  })

  const handleSubmit = async (
    values: PermissionFormValue,
    { setSubmitting }: FormikActions<PermissionFormValue>
  ) => {
    try {
      const newPermissions = await updateUserPermissions(
        user.id,
        values.permissions
      )
      setCurrentPermissions(newPermissions)
      TopToaster.showSuccessToast(`User's Permission Updated`)
    } catch (error) {
      if (!handleCommonError(error)) globalErrorCatcher(error)
    } finally {
      setSubmitting(false)
    }
  }

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
}
