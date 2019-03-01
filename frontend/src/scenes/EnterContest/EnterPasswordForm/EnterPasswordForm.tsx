import { Formik, FormikActions, FormikProps } from 'formik'
import React, { FunctionComponent, useEffect } from 'react'
import { useForgotPassword, useMe, usePublicOnly, useSignIn } from 'ugrade/auth'
import { handleCommonError } from 'ugrade/common'
import { useContestInfo } from 'ugrade/contest'
import * as yup from 'yup'
import { useReset, useResetAccount } from '../actions'
import { EnterPasswordFormView } from './EnterPasswordFormView'

export interface EnterPasswordFormValue {
  password: string
  rememberMe: boolean
}

export const EnterPasswordForm: FunctionComponent = () => {
  usePublicOnly()

  const initialValue: EnterPasswordFormValue = {
    password: '',
    rememberMe: false,
  }

  const validationSchema = yup.object().shape({
    password: yup
      .string()
      .min(4)
      .max(255)
      .label('Password')
      .required(),
    rememberMe: yup.boolean().required(),
  })

  const signIn = useSignIn()

  const handleSubmit = async (
    values: EnterPasswordFormValue,
    { setSubmitting }: FormikActions<EnterPasswordFormValue>
  ) => {
    try {
      await signIn(values.password, values.rememberMe)
    } catch (error) {
      if (!handleCommonError(error)) throw error
    } finally {
      setSubmitting(false)
    }
  }

  const contestInfo = useContestInfo()
  const resetContest = useReset()
  const resetAccount = useResetAccount()
  const me = useMe()

  useEffect(() => {
    if (!contestInfo) resetContest()
    if (!me) resetAccount()
  }, [])

  const forgotPassword = useForgotPassword()

  const handleForgotPassword = async (
    setSubmitting: (val: boolean) => void
  ) => {
    try {
      await forgotPassword()
    } catch (error) {
      if (!handleCommonError(error)) throw error
    } finally {
      setSubmitting(false)
    }
  }

  if (!contestInfo || !me) return <React.Fragment />

  const renderView = (props: FormikProps<EnterPasswordFormValue>) => (
    <EnterPasswordFormView
      {...props}
      contest={contestInfo}
      gotoAnotherContest={resetContest}
      gotoAnotherAccount={resetAccount}
      forgotPassword={handleForgotPassword}
      username={me.username}
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
