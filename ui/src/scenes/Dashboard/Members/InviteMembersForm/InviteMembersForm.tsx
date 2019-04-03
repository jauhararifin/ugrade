import { useContestOnly } from '@/auth'
import { BasicError } from '@/components/BasicError/BasicError'
import { showError } from '@/error'
import { useRouting } from '@/routing'
import { showSuccessToast } from '@/toaster'
import { Formik, FormikActions, FormikProps } from 'formik'
import gql from 'graphql-tag'
import React, { FunctionComponent } from 'react'
import { useMutation, useQuery } from 'react-apollo-hooks'
import * as yup from 'yup'
import { SimpleLoading } from '../../components/SimpleLoading'
import { adminPermissions, allPermissions, contestantPermissions } from '../../permissions'
import { InviteMembersFormView } from './InviteMembersFormView'
import { GetMyPermissions } from './types/GetMyPermissions'
import { InviteUsers } from './types/InviteUsers'

export interface InviteMembersFormValue {
  emails: string[]
  permissions: string[]
}

export const InviteMembersForm: FunctionComponent = () => {
  useContestOnly()
  const routingStore = useRouting()
  const { data, loading, error } = useQuery<GetMyPermissions>(gql`
    query GetMyPermissions {
      me {
        id
        permissions
      }
    }
  `)
  const inviteMutate = useMutation<InviteUsers>(gql`
    mutation InviteUsers($emails: [String!]!, $permissions: [String!]!) {
      inviteUsers(emails: $emails, permissions: $permissions) {
        id
        username
        name
      }
    }
  `)

  if (loading) return <SimpleLoading />
  if (error || !data || !data.me) return <BasicError />

  const availablePermissions = [...allPermissions]
  const predifinedPermissions = {
    Contestant: [...contestantPermissions],
    Admin: [...adminPermissions],
  }

  const initialValues: InviteMembersFormValue = {
    emails: [],
    permissions: [],
  }

  const validationSchema = yup.object().shape({
    emails: yup
      .array()
      .label('Emails')
      .of(
        yup
          .string()
          .label('Email')
          .email()
          .max(255)
          .required()
      )
      .min(1)
      .max(500)
      .required(),
    permissions: yup
      .array()
      .label(`User's Permissions`)
      .of(
        yup
          .string()
          .oneOf(allPermissions)
          .required()
      ),
  })

  const handleSubmit = async (
    values: InviteMembersFormValue,
    { setSubmitting }: FormikActions<InviteMembersFormValue>
  ) => {
    try {
      await inviteMutate({
        variables: values,
      })
      showSuccessToast(`New Members Invited`)
      routingStore.push(`/contest/members`)
    } catch (error) {
      showError(error)
    } finally {
      setSubmitting(false)
    }
  }

  const givablePermissions = data.me.permissions
  const renderView = (props: FormikProps<InviteMembersFormValue>) => (
    <InviteMembersFormView
      availablePermissions={availablePermissions}
      givablePermissions={givablePermissions}
      predifinedPermissions={predifinedPermissions}
      {...props}
    />
  )

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      render={renderView}
    />
  )
}
