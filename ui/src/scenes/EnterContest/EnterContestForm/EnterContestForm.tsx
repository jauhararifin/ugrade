import { Formik, FormikActions } from 'formik'
import React, { FunctionComponent } from 'react'
import * as yup from 'yup'
import { useContest, useRouting } from '../../../app'
import { showErrorToast, usePublicOnly } from '../../../common'
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
  const contestStore = useContest()
  const handleSubmit = async (
    values: EnterContestFormValue,
    { setSubmitting }: FormikActions<EnterContestFormValue>
  ) => {
    try {
      await contestStore.setByShortId(values.contestId)
      routingStore.push('/enter-contest/enter-email')
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
      component={EnterContestFormView}
    />
  )
}
