import { Formik, FormikActions } from 'formik'
import React, { Component, ComponentType } from 'react'
import * as yup from 'yup'

import { connect } from 'react-redux'
import { compose } from 'redux'
import ActionToaster from '../../../helpers/ActionToaster'
import { publicOnly } from '../../../helpers/auth'
import { AuthError } from '../../../services/auth'
import { ContestError } from '../../../services/contest/errors'
import { AppThunkDispatch } from '../../../stores'
import { createContestAction } from './actions'
import CreateContestFormView from './CreateContestFormView'

export interface CreateContestFormValue {
  email: string
  contestShortId: string
  contestName: string
  contestShortDescription: string
}

export interface ContestFormProps {
  dispatch: AppThunkDispatch
}

export class ContestForm extends Component<ContestFormProps> {
  initialValue: CreateContestFormValue = {
    email: '',
    contestShortId: '',
    contestName: '',
    contestShortDescription: '',
  }

  validationSchema = yup.object().shape({
    email: yup
      .string()
      .min(4)
      .max(255)
      .email()
      .required(),
    contestShortId: yup
      .string()
      .min(4)
      .max(255)
      .label('Contest ID')
      .matches(
        /[a-zA-Z0-9\-]+/,
        'Contest ID contains alphanumeric and dash character only'
      )
      .required(),
    contestName: yup
      .string()
      .max(255)
      .label('Contest Name')
      .required(),
    contestShortDescription: yup
      .string()
      .max(255)
      .label('Short Description'),
  })

  handleSubmit = async (
    values: CreateContestFormValue,
    { setSubmitting }: FormikActions<CreateContestFormValue>
  ) => {
    try {
      await this.props.dispatch(
        createContestAction(
          values.email,
          values.contestShortId,
          values.contestName,
          values.contestShortDescription
        )
      )
      ActionToaster.showSuccessToast('Contest Created')
    } catch (error) {
      if (error instanceof AuthError || error instanceof ContestError) {
        ActionToaster.showErrorToast(error)
      } else throw error
    } finally {
      setSubmitting(false)
    }
  }

  render() {
    return (
      <Formik
        initialValues={this.initialValue}
        validationSchema={this.validationSchema}
        onSubmit={this.handleSubmit}
        component={CreateContestFormView}
      />
    )
  }
}

export default compose<ComponentType>(
  publicOnly(),
  connect()
)(ContestForm)
