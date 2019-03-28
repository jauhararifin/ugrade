import { useAuth, useContest, useRouting } from '@/app'
import { showErrorToast, usePublicOnly } from '@/common'
import { Formik, FormikActions, FormikProps } from 'formik'
import React, { FunctionComponent, useEffect } from 'react'
import * as yup from 'yup'
import { useReset, useResetAccount } from '../reset'
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

  const authStore = useAuth()
  const contestStore = useContest()
  const routingStore = useRouting()

  const handleSubmit = async (
    values: ResetPasswordFormValue,
    { setSubmitting }: FormikActions<ResetPasswordFormValue>
  ) => {
    try {
      await authStore.resetPassword(values.password, values.oneTimeCode)
      routingStore.push('/enter-contest/enter-password')
    } catch (error) {
      showErrorToast(error)
    } finally {
      setSubmitting(false)
    }
  }

  const resetContest = useReset()
  const resetAccount = useResetAccount()
  useEffect(() => {
    if (!contestStore.current) resetContest()
  }, [])
  if (!contestStore.current) return <React.Fragment />

  const renderView = (props: FormikProps<ResetPasswordFormValue>) => {
    if (!contestStore.current) return <React.Fragment />
    return (
      <ResetPasswordFormView
        {...props}
        contest={contestStore.current}
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
