import { useContest, useRouting } from '@/app'
import { showErrorToast, showSuccessToast } from '@/common/toaster'
import { Formik, FormikActions } from 'formik'
import React, { FunctionComponent } from 'react'
import * as yup from 'yup'
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
      .max(255)
      .label('Contest Name')
      .required(),
    shortDescription: yup
      .string()
      .max(255)
      .label('Short Description'),
  })

  const routing = useRouting()
  const contest = useContest()
  const handleSubmit = async (
    values: CreateContestFormValue,
    { setSubmitting, setErrors }: FormikActions<CreateContestFormValue>
  ) => {
    try {
      await contest.create(values.email, values.shortId, values.name, values.shortDescription)
      showSuccessToast('Contest Created')
      routing.push('/enter-contest')
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

  return (
    <Formik
      initialValues={initialValue}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      component={CreateContestFormView}
    />
  )
}
