import React, { Component, ComponentType } from 'react'
import * as yup from 'yup'

import { Formik, FormikActions } from 'formik'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { AppThunkDispatch } from '../../../stores'
import { setTitle } from '../../../stores/Title'
import { forgotPasswordAction } from './actions'
import { ForgotPasswordFormView } from './ForgotPasswordFormView'

export interface ForgotPasswordFormValue {
  usernameOrEmail: string
}

export interface ForgotPasswordFormReduxProps {
  dispatch: AppThunkDispatch
}

export type ForgotPasswordFormProps = ForgotPasswordFormReduxProps

export class ForgotPasswordForm extends Component<ForgotPasswordFormProps> {
  initialValue = { usernameOrEmail: '' }

  validationSchema = yup.object().shape({
    usernameOrEmail: yup
      .string()
      .label('username or email')
      .required(),
  })

  componentDidMount() {
    this.props.dispatch(setTitle('UGrade | Forgot Password'))
  }

  handleSubmit = (
    values: ForgotPasswordFormValue,
    { setSubmitting, resetForm }: FormikActions<ForgotPasswordFormValue>
  ) => {
    this.props
      .dispatch(forgotPasswordAction(values.usernameOrEmail))
      .finally(() => {
        setSubmitting(false)
        resetForm()
      })
      .catch(_ => null)
  }

  render() {
    return (
      <Formik
        initialValues={this.initialValue}
        onSubmit={this.handleSubmit}
        validationSchema={this.validationSchema}
        component={ForgotPasswordFormView}
      />
    )
  }
}

export default compose<ComponentType>(connect())(ForgotPasswordForm)
