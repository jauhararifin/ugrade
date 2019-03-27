import { Formik, FormikActions, FormikProps } from 'formik'
import { useObserver } from 'mobx-react-lite'
import React, { FunctionComponent } from 'react'
import * as yup from 'yup'
import { useAuth, useContest, useRouting } from '../../../../app'
import { adminPermissions, allPermissions, contestantPermissions, Permission } from '../../../../auth'
import { showErrorToast, showSuccessToast, useContestOnly } from '../../../../common'
import { InviteMembersFormView } from './InviteMembersFormView'

export interface InviteMembersFormValue {
  emails: string[]
  permissions: Permission[]
}

export const InviteMembersForm: FunctionComponent = () => {
  useContestOnly()
  const authStore = useAuth()
  const contestStore = useContest()
  const routingStore = useRouting()
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
      await contestStore.invite(values.emails, values.permissions)
      showSuccessToast(`New Members Invited`)
      routingStore.push(`/contest/members`)
    } catch (error) {
      showErrorToast(error)
    } finally {
      setSubmitting(false)
    }
  }

  return useObserver(() => {
    const me = authStore.me
    const givablePermissions = me ? me.permissions : []
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
  })
}
