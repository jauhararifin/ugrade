import React, { ComponentType } from "react"
import { Formik, FormikActions } from "formik"
import { push } from "connected-react-router"
import { connect } from "react-redux"
import * as yup from 'yup'

import "./styles.css"

import {  SignUpFormValue } from "./SignUpForm"
import { AppThunkDispatch } from "../../stores"
import { signUpAction } from "./actions"
import ActionToaster from "../../middlewares/ErrorToaster/ActionToaster"
import { compose } from "redux";
import { publicOnly } from "../../helpers/auth";
import SignUpPage from "./SignUpPage";

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
    email: yup.string().email().required(),
    name: yup.string().required(),
    password: yup.string().min(8).required(),
  })

  handleSubmit = (values: SignUpFormValue, { setSubmitting, setStatus }: FormikActions<SignUpFormValue>) => {
    this.props.dispatch(signUpAction(values.username, values.name, values.email, values.password))
      .then(result => {
        setStatus(result)
        if (result && result.success) {
          this.props.dispatch(push('/signin'))
          ActionToaster.showSuccessToast("Your Account Successfully Created")
        }
      })
      .finally(() => setSubmitting(false))
  }

  render() {
    return <Formik
      validationSchema={this.validationSchema}
      onSubmit={this.handleSubmit}
      initialValues={this.initialValues}
      component={SignUpPage} />
  }
}

export default compose<ComponentType>(
  publicOnly(),
  connect()
)(SignUpScene)
