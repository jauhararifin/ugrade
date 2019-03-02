import { Formik, FormikActions } from 'formik'
import React, { FunctionComponent } from 'react'
import { useContestOnly } from 'ugrade/auth'
import { handleCommonError } from 'ugrade/common'
import { TopToaster } from 'ugrade/common/ActionToaster'
import { useCreateClarificationEntry } from 'ugrade/contest/clarification'
import * as yup from 'yup'
import { CreateClarificationEntryFormView } from './CreateClarificationEntryFormView'

export interface CreateClarificationEntryFormValues {
  content: string
}

export interface CreateClarificationEntryFormProps {
  clarificationId: string
}

export const CreateClarificationEntryForm: FunctionComponent<
  CreateClarificationEntryFormProps
> = ({ clarificationId }) => {
  useContestOnly()

  const validationSchema = yup.object().shape({
    content: yup.string().required(),
  })

  const initialValue = {
    content: '',
  }

  const createClarificationEntry = useCreateClarificationEntry()

  const handleSubmit = async (
    values: CreateClarificationEntryFormValues,
    {
      setSubmitting,
      resetForm,
    }: FormikActions<CreateClarificationEntryFormValues>
  ) => {
    try {
      await createClarificationEntry(clarificationId, values.content)
      TopToaster.showSuccessToast('Clarification Reply Submitted')
    } catch (error) {
      if (!handleCommonError(error)) throw error
    } finally {
      setSubmitting(false)
      resetForm()
    }
  }

  return (
    <Formik
      initialValues={initialValue}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      component={CreateClarificationEntryFormView}
    />
  )
}
