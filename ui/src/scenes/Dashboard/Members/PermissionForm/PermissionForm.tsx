import { BasicError } from '@/components/BasicError/BasicError'
import { showError } from '@/error'
import { showSuccessToast } from '@/toaster'
import { Formik, FormikActions, FormikProps } from 'formik'
import gql from 'graphql-tag'
import React, { FunctionComponent, useState } from 'react'
import { useMutation, useQuery } from 'react-apollo-hooks'
import * as yup from 'yup'
import { SimpleLoading } from '../../components/SimpleLoading'
import { allPermissions } from '../../permissions'
import { PermissionFormView } from './PermissionFormView'
import { GetMyPermissions } from './types/GetMyPermissions'

export interface PermissionFormValue {
  permissions: string[]
}

export interface PermissionFormProps {
  user: { id: string; permissions: string[] }
}

export const PermissionForm: FunctionComponent<PermissionFormProps> = ({ user }) => {
  const { data, loading, error } = useQuery<GetMyPermissions>(gql`
    query GetMyPermissions {
      me {
        id
        permissions
      }
    }
  `)
  const [currentPermissions, setCurrentPermissions] = useState(user.permissions)

  const updatePermissionMutate = useMutation(gql`
    mutation UpdatePermission($userId: ID!, $permissions: [String!]!) {
      updateUserPermissions(userId: $userId, permissions: $permissions) {
        id
        permissions
      }
    }
  `)

  if (loading) return <SimpleLoading />
  if (error || !data || !data.me) return <BasicError />

  const availablePermissions = [...allPermissions]
  const validationSchema = yup.object().shape({
    permissions: yup
      .array()
      .label('Permissions')
      .of(yup.string().oneOf(availablePermissions)),
  })

  const handleSubmit = async (values: PermissionFormValue, { setSubmitting }: FormikActions<PermissionFormValue>) => {
    try {
      await updatePermissionMutate({
        variables: {
          userId: user.id,
          permissions: values.permissions,
        },
      })
      setCurrentPermissions(values.permissions)
      showSuccessToast(`User's Permission Updated`)
    } catch (error) {
      showError(error)
    } finally {
      setSubmitting(false)
    }
  }

  const initialValue: PermissionFormValue = {
    permissions: currentPermissions,
  }

  const updatablePermissions = data.me.permissions
  if (!availablePermissions || !updatablePermissions) return <SimpleLoading />

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
