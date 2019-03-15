import { Formik, FormikActions, FormikProps } from 'formik'
import React, { FunctionComponent } from 'react'
import { useContestOnly, useInviteUsers, useMyPermissions } from 'ugrade/auth'
import {
  adminPermissions,
  allPermissions,
  contestantPermissions,
  UserPermission,
} from 'ugrade/auth/store'
import { globalErrorCatcher, handleCommonError } from 'ugrade/common'
import { TopToaster } from 'ugrade/common/ActionToaster'
import { usePush } from 'ugrade/router'
import * as yup from 'yup'
import { InviteMembersFormView } from './InviteMembersFormView'

export interface InviteMembersFormValue {
  emails: string[]
  permissions: UserPermission[]
}

export const InviteMembersForm: FunctionComponent = () => {
  useContestOnly()
  const availablePermissions = [...allPermissions]
  const givablePermissions = useMyPermissions()
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

  const inviteUsers = useInviteUsers()
  const push = usePush()

  const handleSubmit = async (
    values: InviteMembersFormValue,
    { setSubmitting }: FormikActions<InviteMembersFormValue>
  ) => {
    try {
      await inviteUsers(values.emails, values.permissions)
      TopToaster.showSuccessToast(`New Members Invited`)
      push(`/contest/members`)
    } catch (error) {
      if (!handleCommonError(error)) globalErrorCatcher(error)
    } finally {
      setSubmitting(false)
    }
  }

  if (!givablePermissions) {
    return null
  }

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
