import { Formik, FormikActions, FormikProps } from 'formik'
import React, { ComponentType } from 'react'
import * as yup from 'yup'

import './styles.css'

import { compose } from 'redux'
import { publicOnly } from '../../../helpers/auth'
import { ContestInfo } from '../../../stores/Contest'
import { SignUpFormValue } from './SignUpForm'
import { SignUpFormView } from './SignUpFormView'

export interface SignUpFormValue {
  username: string
  name: string
  password: string
  rememberMe: boolean
}

export interface SignUpFormProps {
  onSubmit: (
    values: SignUpFormValue,
    { setSubmitting }: FormikActions<SignUpFormValue>
  ) => any
  contestInfo: ContestInfo
}

class SignUpForm extends React.Component<SignUpFormProps> {
  initialValues = {
    username: '',
    name: '',
    password: '',
    rememberMe: false,
  }

  validationSchema = yup.object().shape({
    username: yup
      .string()
      .matches(/[a-zA-Z0-9\-]+/)
      .min(4)
      .max(255)
      .required(),
    name: yup
      .string()
      .min(4)
      .max(255)
      .required(),
    password: yup
      .string()
      .min(8)
      .max(255)
      .required(),
    rememberMe: yup.boolean().required(),
  })

  render() {
    const renderView = (props: FormikProps<SignUpFormValue>) => (
      <SignUpFormView {...props} contestInfo={this.props.contestInfo} />
    )
    return (
      <Formik
        validationSchema={this.validationSchema}
        onSubmit={this.props.onSubmit}
        initialValues={this.initialValues}
        render={renderView}
      />
    )
  }
}

export default compose<ComponentType<SignUpFormProps>>(publicOnly())(SignUpForm)
