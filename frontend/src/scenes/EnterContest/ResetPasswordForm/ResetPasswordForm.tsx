import { Formik, FormikActions, FormikProps } from 'formik'
import React, { ComponentType } from 'react'
import * as yup from 'yup'

import './styles.css'

import { compose } from 'redux'
import { publicOnly } from '../../../helpers/auth'
import { ContestInfo } from '../../../stores/Contest'
import { ResetPasswordFormValue } from './ResetPasswordForm'
import { ResetPasswordFormView } from './ResetPasswordFormView'

export interface ResetPasswordFormValue {
  oneTimeCode: string
  password: string
}

export interface ResetPasswordFormProps {
  onSubmit: (
    values: ResetPasswordFormValue,
    { setSubmitting }: FormikActions<ResetPasswordFormValue>
  ) => any
  contestInfo: ContestInfo
  gotoAnotherContest: () => any
}

class ResetPasswordForm extends React.Component<ResetPasswordFormProps> {
  initialValues = {
    oneTimeCode: '',
    password: '',
  }

  validationSchema = yup.object().shape({
    oneTimeCode: yup
      .string()
      .label('One Time Code')
      .matches(/.{8}/, 'Invalid One Time Code')
      .required(),
    password: yup
      .string()
      .min(8)
      .max(255)
      .required(),
  })

  render() {
    const renderView = (props: FormikProps<ResetPasswordFormValue>) => (
      <ResetPasswordFormView
        {...props}
        contestInfo={this.props.contestInfo}
        gotoAnotherContest={this.props.gotoAnotherContest}
      />
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

export default compose<ComponentType<ResetPasswordFormProps>>(publicOnly())(
  ResetPasswordForm
)
