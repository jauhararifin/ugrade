import { Formik, FormikActions, FormikProps } from 'formik'
import React, { FunctionComponent, useEffect } from 'react'
import { usePublicOnly, useSignUp } from 'ugrade/auth'
import { handleCommonError } from 'ugrade/common'
import { useContestInfo } from 'ugrade/contest'
import * as yup from 'yup'
import { useReset, useResetAccount } from '../actions'
import { SignUpFormValue } from './SignUpForm'
import { SignUpFormView } from './SignUpFormView'

import './styles.css'

export interface SignUpFormValue {
  username: string
  name: string
  oneTimeCode: string
  password: string
  rememberMe: boolean
}

export const SignUpForm: FunctionComponent = () => {
  usePublicOnly()

  const initialValues = {
    username: '',
    name: '',
    oneTimeCode: '',
    password: '',
    rememberMe: false,
  }

  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .matches(
        /[a-zA-Z0-9\-]+/,
        'Should contain alphanumeric and dash character only'
      )
      .min(4)
      .max(255)
      .required(),
    name: yup
      .string()
      .min(4)
      .max(255)
      .required(),
    oneTimeCode: yup
      .string()
      .label('One Time Code')
      .matches(/.{8}/, 'Invalid One Time Code')
      .required(),
    password: yup
      .string()
      .min(8)
      .max(255)
      .required(),
    rememberMe: yup.boolean().required(),
  })

  const contestInfo = useContestInfo()
  const resetContest = useReset()
  const resetAccount = useResetAccount()
  const signUp = useSignUp()

  useEffect(() => {
    if (!contestInfo) resetContest()
  }, [])

  const handleSubmit = async (
    values: SignUpFormValue,
    { setSubmitting }: FormikActions<SignUpFormValue>
  ) => {
    try {
      await signUp(
        values.username,
        values.oneTimeCode,
        values.password,
        values.name,
        values.rememberMe
      )
    } catch (error) {
      if (!handleCommonError(error)) throw error
    } finally {
      setSubmitting(false)
    }
  }

  if (!contestInfo) return <React.Fragment />

  const renderView = (props: FormikProps<SignUpFormValue>) => (
    <SignUpFormView
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
