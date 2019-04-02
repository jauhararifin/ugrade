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
import { useReset } from '../reset'
import { useSetEmail } from './action'
import { EnterEmailFormView } from './EnterEmailFormView'

export interface EnterEmailFormValue {
  email: string
}

export const EnterEmailForm: FunctionComponent = () => {
  usePublicOnly()

  const initialValue: EnterEmailFormValue = { email: '' }
  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .min(4)
      .max(255)
      .email()
      .label('Email')
      .required(),
  })

  const [, contestId] = useMatch(/enter-contest\/([0-9]+)\/users/)
  const setEmail = useSetEmail(contestId)
  const resetContest = useReset()
  const handleSubmit = async (values: EnterEmailFormValue, { setSubmitting }: FormikActions<EnterEmailFormValue>) => {
    try {
      await setEmail(values.email)
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

  if (error) return <BasicError />
  if (loading) return <BasicLoading />
  const renderView = (props: FormikProps<EnterEmailFormValue>) => {
    if (!data) return <React.Fragment />
    return <EnterEmailFormView contest={data.contest} gotoAnotherContest={resetContest} {...props} />
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
