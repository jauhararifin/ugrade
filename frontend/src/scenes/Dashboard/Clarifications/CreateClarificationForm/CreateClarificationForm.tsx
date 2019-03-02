import { Formik, FormikActions, FormikProps } from 'formik'
import React, { FunctionComponent } from 'react'
import { useContestOnly } from 'ugrade/auth'
import { handleCommonError } from 'ugrade/common'
import { TopToaster } from 'ugrade/common/ActionToaster'
import { useCreateClarification } from 'ugrade/contest/clarification'
import { useProblemList } from 'ugrade/contest/problem'
import * as yup from 'yup'
import { CreateClarificationFormView } from './CreateClarificationFormView'

export interface CreateClarificationFormValue {
  title: string
  subject: string
  content: string
}

export const CreateClarificationForm: FunctionComponent = () => {
  useContestOnly()
  const problems = useProblemList()

  const validationSchema = yup.object().shape({
    title: yup.string().required(),
    subject: yup.string().required(),
    content: yup.string().required(),
  })

  const initialValue: CreateClarificationFormValue = {
    title: '',
    subject: 'General Issue',
    content: '',
  }

  const createClarification = useCreateClarification()

  const handleSubmit = async (
    values: CreateClarificationFormValue,
    { setSubmitting, resetForm }: FormikActions<CreateClarificationFormValue>
  ) => {
    try {
      await createClarification(values.title, values.subject, values.content)
      TopToaster.showSuccessToast('Clarification Sent')
    } catch (error) {
      if (!handleCommonError(error)) throw error
    } finally {
      setSubmitting(false)
      resetForm()
    }
  }

  const getSubjects = () =>
    problems
      ? [
          { label: 'General Issue', value: 'General Issue' },
          { label: 'Technical Issue', value: 'Technical Issue' },
          ...problems.map(problem => ({
            label: `Problem: ${problem.name}`,
            value: `Problem: ${problem.name}`,
          })),
        ]
      : []

  const createView = (props: FormikProps<CreateClarificationFormValue>) => (
    <CreateClarificationFormView subjectOptions={getSubjects()} {...props} />
  )
  return (
    <Formik
      initialValues={initialValue}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      render={createView}
    />
  )
}
