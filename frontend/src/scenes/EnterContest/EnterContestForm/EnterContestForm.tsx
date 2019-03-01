import { Formik, FormikActions } from 'formik'
import React, { FunctionComponent } from 'react'
import { usePublicOnly } from 'ugrade/auth'
import { handleCommonError } from 'ugrade/common'
import { useSetContest } from 'ugrade/contest'
import * as yup from 'yup'
import EnterContestFormView from './EnterContestFormView'

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
      .matches(
        /[a-zA-Z0-9\-]+/,
        'Contest ID contains alphanumeric and dash character only'
      )
      .required(),
  })

  const setContest = useSetContest()

  const handleSubmit = async (
    values: EnterContestFormValue,
    { setSubmitting }: FormikActions<EnterContestFormValue>
  ) => {
    try {
      await setContest(values.contestId)
    } catch (error) {
      if (!handleCommonError(error)) throw error
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
