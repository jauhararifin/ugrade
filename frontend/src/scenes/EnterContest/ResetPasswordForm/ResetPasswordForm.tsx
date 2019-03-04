import { Formik, FormikActions, FormikProps } from 'formik'
import React, { FunctionComponent, useEffect } from 'react'
import { usePublicOnly } from 'ugrade/auth'
import { handleCommonError } from 'ugrade/common'
import { useContestInfo } from 'ugrade/contest'
import * as yup from 'yup'
import { useReset, useResetAccount, useResetPassword } from '../actions'
import { ResetPasswordFormView } from './ResetPasswordFormView'

import './styles.css'

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

  const resetPassword = useResetPassword()
  const resetContest = useReset()
  const resetAccount = useResetAccount()
  const contestInfo = useContestInfo()

  const handleSubmit = async (
    values: ResetPasswordFormValue,
    { setSubmitting }: FormikActions<ResetPasswordFormValue>
  ) => {
    try {
      await resetPassword(values.oneTimeCode, values.password)
    } catch (error) {
      if (!handleCommonError(error)) throw error
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    if (!contestInfo) resetContest()
  }, [])

  if (!contestInfo) return <React.Fragment />

  const renderView = (props: FormikProps<ResetPasswordFormValue>) => (
    <ResetPasswordFormView
      {...props}
      contest={contestInfo}
      gotoAnotherContest={resetContest}
      gotoAnotherAccount={resetAccount}
    />
  )
  return (
    <Formik
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      initialValues={initialValues}
      render={renderView}
    />
  )
}
