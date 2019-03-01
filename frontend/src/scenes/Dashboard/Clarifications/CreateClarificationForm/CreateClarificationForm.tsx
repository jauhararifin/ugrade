import { Formik, FormikActions, FormikProps } from 'formik'
import React, { ComponentType, FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { TopToaster } from 'ugrade/common/ActionToaster'
import { getProblemList, Problem } from 'ugrade/contest/store'
import { contestOnly } from 'ugrade/helpers/auth'
import { ContestError } from 'ugrade/services/contest/errors'
import { AppState, AppThunkDispatch } from 'ugrade/store'
import * as yup from 'yup'
import { useProblems } from '../../helpers'
import { createClarificationAction } from './actions'
import { CreateClarificationFormView } from './CreateClarificationFormView'

export interface CreateClarificationFormValue {
  title: string
  subject: string
  content: string
}

export interface CreateClarificationFormProps {
  problems?: Problem[]
  dispatch: AppThunkDispatch
}

export const CreateClarificationForm: FunctionComponent<
  CreateClarificationFormProps
> = ({ problems, dispatch }) => {
  useProblems(dispatch)

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

  const handleSubmit = async (
    values: CreateClarificationFormValue,
    { setSubmitting, resetForm }: FormikActions<CreateClarificationFormValue>
  ) => {
    try {
      await dispatch(
        createClarificationAction(values.title, values.subject, values.content)
      )
      TopToaster.showSuccessToast('Clarification Sent')
    } catch (error) {
      if (error instanceof ContestError) TopToaster.showErrorToast(error)
      else throw error
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

const mapStateToProps = (state: AppState) => ({
  problems: getProblemList(state),
})

export default compose<ComponentType>(
  contestOnly(),
  connect(mapStateToProps)
)(CreateClarificationForm)
