import { Formik, FormikActions, FormikProps } from 'formik'
import React, { FunctionComponent, useEffect } from 'react'
import * as yup from 'yup'
import { useAuth, useContest, useRouting } from '../../../app'
import { showErrorToast, showSuccessToast, usePublicOnly } from '../../../common'
import { useReset, useResetAccount } from '../reset'
import { SignUpFormView } from './SignUpFormView'

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
      .label('Username')
      .matches(/[a-zA-Z0-9\-]+/, 'Should contain alphanumeric and dash character only')
      .min(4)
      .max(255)
      .required(),
    name: yup
      .string()
      .label('Name')
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
      .label('Password')
      .min(8)
      .max(255)
      .required(),
    rememberMe: yup.boolean().required(),
  })

  const contestStore = useContest()
  const authStore = useAuth()
  const resetContest = useReset()
  const resetAccount = useResetAccount()

  useEffect(() => {
    if (!contestStore.current) resetContest()
  }, [])

  const routingStore = useRouting()
  const handleSubmit = async (
    values: SignUpFormValue,
    { setSubmitting, setErrors }: FormikActions<SignUpFormValue>
  ) => {
    try {
      await authStore.signUp(values.username, values.oneTimeCode, values.password, values.name, values.rememberMe)
      showSuccessToast('Signed In')
      routingStore.push('/contest')
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setErrors(error.value)
      } else {
        showErrorToast(error)
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (!contestStore.current) return <React.Fragment />

  const renderView = (props: FormikProps<SignUpFormValue>) => {
    if (!contestStore.current) return <React.Fragment />
    return (
      <SignUpFormView
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
