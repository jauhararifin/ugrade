import { Formik, FormikActions, FormikProps } from 'formik'
import React, { FunctionComponent, useEffect } from 'react'
import * as yup from 'yup'
import { useAuth, useContest, useRouting } from '../../../app'
import { showErrorToast, usePublicOnly } from '../../../common'
import { useReset, useResetAccount } from '../reset'
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
      .min(8)
      .max(255)
      .label('Password')
      .required(),
    rememberMe: yup.boolean().required(),
  })

  const authStore = useAuth()
  const contestStore = useContest()
  const handleSubmit = async (
    values: EnterPasswordFormValue,
    { setSubmitting }: FormikActions<EnterPasswordFormValue>
  ) => {
    try {
      await authStore.signIn(values.password, values.rememberMe)
    } catch (error) {
      showErrorToast(error)
    } finally {
      setSubmitting(false)
    }
  }

  const resetContest = useReset()
  const resetAccount = useResetAccount()
  const me = authStore.me

  useEffect(() => {
    if (!contestStore.current) resetContest()
    if (!me) resetAccount()
  }, [])

  const routingStore = useRouting()
  const handleForgotPassword = async (setSubmitting: (val: boolean) => void) => {
    try {
      await authStore.forgotPassword()
      routingStore.push('/enter-contest/reset-password')
    } catch (error) {
      showErrorToast(error)
    } finally {
      setSubmitting(false)
    }
  }

  const renderView = (props: FormikProps<EnterPasswordFormValue>) => {
    if (!contestStore.current || !me || !me.username) return <React.Fragment />
    return (
      <EnterPasswordFormView
        {...props}
        contest={contestStore.current}
        gotoAnotherContest={resetContest}
        gotoAnotherAccount={resetAccount}
        forgotPassword={handleForgotPassword}
        username={me.username}
      />
    )
  }
  return (
    <Formik
      initialValues={initialValue}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      render={renderView}
    />
  )
}
