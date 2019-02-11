import { Formik, FormikActions } from 'formik'
import React, { ComponentType } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import * as yup from 'yup'

import './styles.css'

import { publicOnly } from '../../helpers/auth'
import { AppThunkDispatch } from '../../stores'
import { forgotPasswordAction } from './actions'
import { ForgotPasswordFormValue } from './ForgotPasswordForm'
import ForgotPasswordPage from './ForgotPasswordPage'

export interface ForgotPasswordSceneProps {
  dispatch: AppThunkDispatch
}

export class ForgotPasswordScene extends React.Component<
  ForgotPasswordSceneProps
> {
  initialValue = { usernameOrEmail: '' }

  validationSchema = yup.object().shape({
    usernameOrEmail: yup
      .string()
      .label('username or email')
      .required(),
  })

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
      .catch(null)
  }

  render() {
    return (
      <Formik
        initialValues={this.initialValue}
        validationSchema={this.validationSchema}
        onSubmit={this.handleSubmit}
        render={ForgotPasswordPage}
      />
    )
  }
}

export default compose<ComponentType>(
  publicOnly(),
  connect()
)(ForgotPasswordScene)
