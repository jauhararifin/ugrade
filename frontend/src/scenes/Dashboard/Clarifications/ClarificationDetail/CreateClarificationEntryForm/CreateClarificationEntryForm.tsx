import { Formik, FormikActions } from 'formik'
import React, { ComponentType, FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { useContestOnly } from 'ugrade/auth'
import { handleCommonError } from 'ugrade/common'
import { TopToaster } from 'ugrade/common/ActionToaster'
import { AppThunkDispatch } from 'ugrade/store'
import * as yup from 'yup'
import { createClarificationEntryAction } from './actions'
import { CreateClarificationEntryFormView } from './CreateClarificationEntryFormView'

export interface CreateClarificationEntryFormValues {
  content: string
}

export interface CreateClarificationEntryFormOwnProps {
  clarificationId: string
}

export interface CreateClarificationEntryFormReduxProps {
  dispatch: AppThunkDispatch
}

export type CreateClarificationEntryFormProps = CreateClarificationEntryFormOwnProps &
  CreateClarificationEntryFormReduxProps

export const CreateClarificationEntryForm: FunctionComponent<
  CreateClarificationEntryFormProps
> = ({ clarificationId, dispatch }) => {
  useContestOnly()

  const validationSchema = yup.object().shape({
    content: yup.string().required(),
  })

  const getInitialValue = () => ({ content: '' })

  const handleSubmit = async (
    values: CreateClarificationEntryFormValues,
    {
      setSubmitting,
      resetForm,
    }: FormikActions<CreateClarificationEntryFormValues>
  ) => {
    try {
      await dispatch(
        createClarificationEntryAction(clarificationId, values.content)
      )
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
      initialValues={getInitialValue()}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      component={CreateClarificationEntryFormView}
    />
  )
}

export default compose<ComponentType<CreateClarificationEntryFormOwnProps>>(
  connect()
)(CreateClarificationEntryForm)
