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
  usernameOrEmail: string
  password: string
  rememberMe: boolean
}

export interface SignInFormProps {
  dispatch: AppThunkDispatch
}

class SignInForm extends React.Component<SignInFormProps, {}> {
  initialValue: SignInFormValue = {
    usernameOrEmail: '',
    password: '',
    rememberMe: false,
  }

  validationSchema = yup.object().shape({
    usernameOrEmail: yup.string().required(),
    password: yup.string().required(),
    rememberMe: yup.boolean(),
  })

  handleSubmit = async (
    values: SignInFormValue,
    { setStatus, setSubmitting }: FormikActions<SignInFormValue>
  ) => {
    try {
      const result = await this.props.dispatch(
        signInAction(values.usernameOrEmail, values.password, values.rememberMe)
      )
      setStatus(result)
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
        component={SignInFormView}
      />
    )
  }
}

export default compose<ComponentType>(
  publicOnly(),
  connect()
)(SignInForm)
