import { showError } from '@/error'
import { showSuccessToast } from '@/toaster'
import { Formik, FormikActions } from 'formik'
import React, { FunctionComponent } from 'react'
import * as yup from 'yup'
import { useCreateContest } from './action'
import { CreateContestFormView } from './CreateContestFormView'

export interface CreateContestFormValue {
  email: string
  shortId: string
  name: string
  shortDescription: string
}

export const CreateContestForm: FunctionComponent = () => {
  const initialValue: CreateContestFormValue = {
    email: '',
    shortId: '',
    name: '',
    shortDescription: '',
  }

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .label('Email')
      .min(4)
      .max(255)
      .email()
      .required(),
    shortId: yup
      .string()
      .min(4)
      .max(255)
      .label('Contest ID')
      .matches(/[a-zA-Z0-9\-]+/, 'Contest ID contains alphanumeric and dash character only')
      .required(),
    name: yup
      .string()
      .min(4)
      .max(255)
      .label('Contest Name')
      .required(),
    shortDescription: yup
      .string()
      .label('Short Description')
      .min(4)
      .max(255)
      .required(),
  })

  const createContest = useCreateContest()
  const handleSubmit = async (
    values: CreateContestFormValue,
    { setSubmitting }: FormikActions<CreateContestFormValue>
  ) => {
    try {
      await createContest(values)
      showSuccessToast('Contest Created')
    } catch (error) {
      showError(error)
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
