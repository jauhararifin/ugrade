import { Formik, FormikActions } from 'formik'
import React, { Component, ComponentType } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import * as yup from 'yup'

import { userOnly } from '../../../../../helpers/auth'
import ActionToaster from '../../../../../middlewares/ErrorToaster/ActionToaster'
import { AppState, AppThunkDispatch } from '../../../../../stores'
import { Contest } from '../../../../../stores/Contest'
import { createClarificationEntry } from './actions'
import { CreateClarificationEntryFormView } from './CreateClarificationEntryFormView'

export interface CreateClarificationEntryFormValues {
  content: string
}

export interface CreateClarificationEntryFormOwnProps {
  clarificationId: number
}

export interface CreateClarificationEntryFormReduxProps {
  contest?: Contest
  dispatch: AppThunkDispatch
}

export type CreateClarificationEntryFormProps = CreateClarificationEntryFormOwnProps &
  CreateClarificationEntryFormReduxProps

export class CreateClarificationEntryForm extends Component<
  CreateClarificationEntryFormProps
> {
  validationSchema = yup.object().shape({
    content: yup.string().required(),
  })
  getInitialValue = () => ({
    content: '',
  })

  handleSubmit = (
    values: CreateClarificationEntryFormValues,
    {
      setSubmitting,
      resetForm,
    }: FormikActions<CreateClarificationEntryFormValues>
  ) => {
    if (this.props.contest) {
      this.props
        .dispatch(
          createClarificationEntry(
            this.props.contest.id,
            this.props.clarificationId,
            values.content
          )
        )
        .then(() =>
          ActionToaster.showSuccessToast('Clarification Reply Submitted')
        )
        .finally(() => {
          setSubmitting(false)
          resetForm()
        })
        .catch(_ => null)
    }
  }

  render() {
    return (
      <Formik
        initialValues={this.getInitialValue()}
        onSubmit={this.handleSubmit}
        validationSchema={this.validationSchema}
        component={CreateClarificationEntryFormView}
      />
    )
  }
}

const mapStateToProps = (state: AppState) => ({
  contest: state.contest.currentContest,
})

export default compose<ComponentType<CreateClarificationEntryFormOwnProps>>(
  userOnly(),
  connect(mapStateToProps)
)(CreateClarificationEntryForm)
