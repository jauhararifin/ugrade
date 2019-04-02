import { usePublicOnly } from '@/auth'
import { showError } from '@/error'
import { useRouting } from '@/routing'
import { Formik, FormikActions } from 'formik'
import React, { FunctionComponent } from 'react'
import * as yup from 'yup'
import { useSetContest } from './action'
import { EnterContestFormView } from './EnterContestFormView'

export interface EnterContestFormValue {
  contestId: string
}

export const EnterContestForm: FunctionComponent = () => {
  usePublicOnly()

  const initialValue: EnterContestFormValue = {
    contestId: '',
  }

  const validationSchema = yup.object().shape({
    contestId: yup
      .string()
      .min(4)
      .max(255)
      .label('Contest ID')
      .matches(/^[a-zA-Z0-9\-]+$/, 'Contest ID contains alphanumeric and dash character only')
      .required(),
  })

  const routingStore = useRouting()
  const setContest = useSetContest()
  const handleSubmit = async (
    values: EnterContestFormValue,
    { setSubmitting }: FormikActions<EnterContestFormValue>
  ) => {
    try {
      await setContest(values.contestId)
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
      component={EnterContestFormView}
    />
  )
}
