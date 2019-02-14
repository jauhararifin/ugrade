import { Formik, FormikActions, FormikProps } from 'formik'
import React, { Component, ComponentType } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import * as yup from 'yup'

import { userOnly } from '../../../../helpers/auth'
import ActionToaster from '../../../../middlewares/ErrorToaster/ActionToaster'
import { AppState, AppThunkDispatch } from '../../../../stores'
import { Contest } from '../../../../stores/Contest'
import { createContestClarification } from './actions'
import { CreateClarificationFormView } from './CreateClarificationFormView'

export interface CreateClarificationFormValue {
  title: string
  subject: string
  content: string
}

export interface CreateClarificationFormProps {
  contest?: Contest
  dispatch: AppThunkDispatch
}

export class CreateClarificationForm extends Component<
  CreateClarificationFormProps
> {
  validationSchema = yup.object().shape({
    title: yup.string().required(),
    subject: yup.string().required(),
    content: yup.string().required(),
  })

  initialValue: CreateClarificationFormValue = {
    title: '',
    subject: 'General Issue',
    content: '',
  }

  handleSubmit = (
    values: CreateClarificationFormValue,
    { setSubmitting, resetForm }: FormikActions<CreateClarificationFormValue>
  ) => {
    if (this.props.contest) {
      this.props
        .dispatch(
          createContestClarification(
            this.props.contest,
            values.title,
            values.subject,
            values.content
          )
        )
        .then(() => ActionToaster.showSuccessToast('Clarification Sent'))
        .finally(() => {
          setSubmitting(false)
          resetForm()
        })
    }
  }

  getSubjects = () =>
    this.props.contest && this.props.contest.problems
      ? [
          { label: 'General Issue', value: 'General Issue' },
          { label: 'Technical Issue', value: 'Technical Issue' },
          ...this.props.contest.problems.map(problem => ({
            label: `Problem: ${problem.name}`,
            value: `Problem: ${problem.name}`,
          })),
        ]
      : []

  render() {
    const createView = (props: FormikProps<CreateClarificationFormValue>) => (
      <CreateClarificationFormView
        subjectOptions={this.getSubjects()}
        {...props}
      />
    )
    return (
      <Formik
        initialValues={this.initialValue}
        onSubmit={this.handleSubmit}
        validationSchema={this.validationSchema}
        render={createView}
      />
    )
  }
}

const mapStateToProps = (state: AppState) => ({
  contest: state.contest.currentContest,
})

export default compose<ComponentType>(
  userOnly(),
  connect(mapStateToProps)
)(CreateClarificationForm)
