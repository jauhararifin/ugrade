import { Formik, FormikActions } from 'formik'
import React, { ComponentType } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import * as yup from 'yup'

import './styles.css'

import { publicOnly } from '../../helpers/auth'
import { AppThunkDispatch } from '../../stores'
import { setTitle } from '../../stores/Title'
import { signInAction } from './actions'
import { SignInFormValue } from './SignInForm'
import SignInPage from './SignInPage'

export interface SignInSceneProps {
  dispatch: AppThunkDispatch
}

class SignInScene extends React.Component<SignInSceneProps, {}> {
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

  componentDidMount() {
    this.props.dispatch(setTitle('UGrade | Sign In'))
  }

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
      .catch(null)
  }

  render() {
    return (
      <Formik
        initialValues={this.initialValue}
        validationSchema={this.validationSchema}
        onSubmit={this.handleSubmit}
        component={SignInPage}
      />
    )
  }
}

export default compose<ComponentType>(
  publicOnly(),
  connect()
)(SignInScene)
