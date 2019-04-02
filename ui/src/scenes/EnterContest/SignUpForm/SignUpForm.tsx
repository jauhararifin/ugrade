import { usePublicOnly } from '@/auth'
import { BasicError } from '@/components/BasicError/BasicError'
import { BasicLoading } from '@/components/BasicLoading/BasicLoading'
import { showError } from '@/error'
import { useMatch, useRouting } from '@/routing'
import { showSuccessToast } from '@/toaster'
import { Formik, FormikActions, FormikProps } from 'formik'
import gql from 'graphql-tag'
import React, { FunctionComponent, useEffect } from 'react'
import { useQuery } from 'react-apollo-hooks'
import * as yup from 'yup'
import { useReset, useResetAccount } from '../reset'
import { useSignUp } from './action'
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

  const [, contestId, userId] = useMatch(/enter-contest\/([0-9]+)\/users\/([0-9]+)\/signup/)
  const signUp = useSignUp(userId)
  const handleSubmit = async (values: SignUpFormValue, { setSubmitting }: FormikActions<SignUpFormValue>) => {
    try {
      await signUp(values, values.rememberMe)
      showSuccessToast('Signed Up')
    } catch (error) {
      showError(error)
    } finally {
      setSubmitting(false)
    }
  }

  const { data, loading, error } = useQuery(
    gql`
      query CurrentContestAndUser($contestId: ID!, $userId: ID!) {
        contest(contestId: $contestId) {
          name
          shortDescription
        }
        user(userId: $userId) {
          username
        }
      }
    `,
    { variables: { contestId, userId } }
  )
  const resetAccount = useResetAccount(contestId)
  const resetContest = useReset()

  if (error) return <BasicError />
  if (loading) return <BasicLoading />

  const routingStore = useRouting()
  if (data.user.username) {
    routingStore.push(`/enter-contest/${contestId}/users/${userId}/password`)
  }

  const renderView = (props: FormikProps<SignUpFormValue>) => {
    return (
      <SignUpFormView
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
