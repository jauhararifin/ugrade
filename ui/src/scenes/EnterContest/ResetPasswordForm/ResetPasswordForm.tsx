import { usePublicOnly } from '@/auth'
import { BasicError } from '@/components/BasicError/BasicError'
import { BasicLoading } from '@/components/BasicLoading/BasicLoading'
import { showError } from '@/error'
import { useMatch } from '@/routing'
import { Formik, FormikActions, FormikProps } from 'formik'
import gql from 'graphql-tag'
import React, { FunctionComponent, useEffect } from 'react'
import { useQuery } from 'react-apollo-hooks'
import * as yup from 'yup'
import { useReset, useResetAccount } from '../reset'
import { useResetPassword } from './action'
import { ResetPasswordFormView } from './ResetPasswordFormView'

export interface ResetPasswordFormValue {
  oneTimeCode: string
  password: string
}

export const ResetPasswordForm: FunctionComponent = () => {
  usePublicOnly()

  const initialValues = {
    oneTimeCode: '',
    password: '',
  }

  const validationSchema = yup.object().shape({
    oneTimeCode: yup
      .string()
      .label('One Time Code')
      .matches(/.{8}/, 'Invalid One Time Code')
      .required(),
    password: yup
      .string()
      .label('New Password')
      .min(8)
      .max(255)
      .required(),
  })

  const [, contestId, userId] = useMatch(/enter-contest\/([0-9]+)\/users\/([0-9]+)\/reset-password/)
  const resetPassword = useResetPassword(contestId, userId)
  const handleSubmit = async (
    values: ResetPasswordFormValue,
    { setSubmitting }: FormikActions<ResetPasswordFormValue>
  ) => {
    try {
      await resetPassword(values.oneTimeCode, values.password)
    } catch (error) {
      showError(error)
    } finally {
      setSubmitting(false)
    }
  }

  const { data, loading, error } = useQuery(
    gql`
      query CurrentContest($contestId: ID!) {
        contest(contestId: $contestId) {
          name
          shortDescription
        }
      }
    `,
    { variables: { contestId } }
  )
  const resetContest = useReset()
  const resetAccount = useResetAccount(contestId)

  if (error) return <BasicError />
  if (loading) return <BasicLoading />
  const renderView = (props: FormikProps<ResetPasswordFormValue>) => {
    return (
      <ResetPasswordFormView
        {...props}
        contest={data.contest}
        gotoAnotherContest={resetContest}
        gotoAnotherAccount={resetAccount}
      />
    )
  }
  return (
    <Formik
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      initialValues={initialValues}
      render={renderView}
    />
  )
}
