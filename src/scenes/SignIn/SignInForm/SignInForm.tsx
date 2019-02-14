import { Formik, FormikActions } from 'formik'
import React, { ComponentType } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import * as yup from 'yup'

import { publicOnly } from '../../../helpers/auth'
import { AppThunkDispatch } from '../../../stores'
import { signInAction } from './actions'
import SignInFormView from './SignInFormView'

export interface SignInFormValue {
  username: string
  password: string
  rememberMe: boolean
}

export interface SignInFormProps {
  dispatch: AppThunkDispatch
}

class SignInForm extends React.Component<SignInFormProps, {}> {
  initialValue: SignInFormValue = {
    username: '',
    password: '',
    rememberMe: false,
  }

  validationSchema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
    rememberMe: yup.boolean(),
  })

  handleSubmit = (
    values: SignInFormValue,
    { setStatus, setSubmitting }: FormikActions<SignInFormValue>
  ) => {
    this.props
      .dispatch(
        signInAction(values.username, values.password, values.rememberMe)
      )
      .then(result => setStatus(result))
      .finally(() => setSubmitting(false))
      .catch(_ => null)
  }

  render() {
    return (
      <Formik
        initialValues={this.initialValue}
        validationSchema={this.validationSchema}
        onSubmit={this.handleSubmit}
        component={SignInFormView}
      />
    )
  }
}

export default compose<ComponentType>(
  publicOnly(),
  connect()
)(SignInForm)
