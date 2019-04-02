import { usePublicOnly } from '@/auth'
import { BasicError } from '@/components/BasicError/BasicError'
import { BasicLoading } from '@/components/BasicLoading/BasicLoading'
import { contestStore } from '@/contest'
import { showError } from '@/error'
import { useMatch } from '@/routing'
import { showSuccessToast } from '@/toaster'
import { Formik, FormikActions, FormikProps } from 'formik'
import gql from 'graphql-tag'
import React, { FunctionComponent, useEffect } from 'react'
import { useQuery } from 'react-apollo-hooks'
import * as yup from 'yup'
import { useReset, useResetAccount } from '../reset'
import { useForgotPassword, useSignIn } from './action'
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

  const signIn = useSignIn()
  const handleSubmit = async (
    values: EnterPasswordFormValue,
    { setSubmitting }: FormikActions<EnterPasswordFormValue>
  ) => {
    try {
      await signIn(values.password, values.rememberMe)
      showSuccessToast('Signed In')
    } catch (error) {
      showError(error)
    } finally {
      setSubmitting(false)
    }
  }

  const forgotPassword = useForgotPassword()
  const handleForgotPassword = async (setSubmitting: (val: boolean) => void) => {
    try {
      await forgotPassword()
    } catch (error) {
      showError(error)
    } finally {
      setSubmitting(false)
    }
  }

  const match = useMatch(/enter-contest\/([0-9]+)\/users\/([0-9]+)\/password/)
  const contestId = match[1]
  const userId = match[2]
  useEffect(() => {
    contestStore.contestId = parseInt(contestId, 10)
    contestStore.userId = parseInt(userId, 10)
  }, [])

  const { data, loading, error } = useQuery(
    gql`
      query CurrentContestAndUser($contestId: Int!, $userId: Int!) {
        contest(contestId: $contestId) {
          name
          shortDescription
        }
        me: user(userId: $userId) {
          username
        }
      }
    `,
    { variables: { contestId, userId } }
  )
  const resetContest = useReset()
  const resetAccount = useResetAccount()

  if (error) return <BasicError />
  if (loading) return <BasicLoading />
  const renderView = (props: FormikProps<EnterPasswordFormValue>) => {
    return (
      <EnterPasswordFormView
        {...props}
        contest={data.contest}
        gotoAnotherContest={resetContest}
        gotoAnotherAccount={resetAccount}
        forgotPassword={handleForgotPassword}
        username={data.me.username}
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
