import { Formik, FormikActions } from 'formik'
import React, { FunctionComponent } from 'react'
import * as yup from 'yup'
import { useContest } from '../../../app'
import { showErrorToast, showSuccessToast } from '../../../common/toaster'
import { CreateContestFormView } from './CreateContestFormView'

export interface CreateContestFormValue {
  email: string
  contestShortId: string
  contestName: string
  contestShortDescription: string
}

export const CreateContestForm: FunctionComponent = () => {
  const initialValue: CreateContestFormValue = {
    email: '',
    contestShortId: '',
    contestName: '',
    contestShortDescription: '',
  }

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .label('Email')
      .min(4)
      .max(255)
      .email()
      .required(),
    contestShortId: yup
      .string()
      .min(4)
      .max(255)
      .label('Contest ID')
      .matches(/[a-zA-Z0-9\-]+/, 'Contest ID contains alphanumeric and dash character only')
      .required(),
    contestName: yup
      .string()
      .max(255)
      .label('Contest Name')
      .required(),
    contestShortDescription: yup
      .string()
      .max(255)
      .label('Short Description'),
  })

  const contest = useContest()
  const handleSubmit = async (
    values: CreateContestFormValue,
    { setSubmitting }: FormikActions<CreateContestFormValue>
  ) => {
    try {
      await contest.create(values.email, values.contestShortId, values.contestName, values.contestShortDescription)
      showSuccessToast('Contest Created')
    } catch (error) {
      showErrorToast(error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Formik
      initialValues={initialValue}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      component={CreateContestFormView}
    />
  )
}
