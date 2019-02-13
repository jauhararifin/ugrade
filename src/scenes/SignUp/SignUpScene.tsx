import { Formik, FormikActions } from 'formik'
import React, { ComponentType } from 'react'
import { connect } from 'react-redux'
import * as yup from 'yup'

import './styles.css'

import { compose } from 'redux'
import { publicOnly } from '../../helpers/auth'
import { AppThunkDispatch } from '../../stores'
import { setTitle } from '../../stores/Title'
import { signUpAction } from './actions'
import { SignUpFormValue } from './SignUpForm'
import SignUpPage from './SignUpPage'

export interface SignUpSceneProps {
  dispatch: AppThunkDispatch
}

class SignUpScene extends React.Component<SignUpSceneProps> {
  initialValues = {
    username: '',
    name: '',
    email: '',
    password: '',
  }

  validationSchema = yup.object().shape({
    username: yup.string().required(),
    email: yup
      .string()
      .email()
      .required(),
    name: yup.string().required(),
    password: yup
      .string()
      .min(8)
      .required(),
  })

  componentDidMount() {
    this.props.dispatch(setTitle('UGrade | Sign Up'))
  }

  handleSubmit = (
    values: SignUpFormValue,
    { setSubmitting, setStatus }: FormikActions<SignUpFormValue>
  ) => {
    this.props
      .dispatch(
        signUpAction(
          values.username,
          values.name,
          values.email,
          values.password
        )
      )
      .then(result => setStatus(result))
      .finally(() => setSubmitting(false))
      .catch(_ => null)
  }

  render() {
    return (
      <Formik
        validationSchema={this.validationSchema}
        onSubmit={this.handleSubmit}
        initialValues={this.initialValues}
        component={SignUpPage}
      />
    )
  }
}

export default compose<ComponentType>(
  publicOnly(),
  connect()
)(SignUpScene)
