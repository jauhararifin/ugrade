import { Formik, FormikActions, FormikProps } from 'formik'
import React, { ComponentType } from 'react'
import { compose } from 'redux'
import * as yup from 'yup'

import { publicOnly } from '../../../helpers/auth'
import { ContestInfo } from '../../../stores/Contest'
import EnterPasswordFormView from './EnterPasswordFormView'

export interface EnterPasswordFormValue {
  password: string
  rememberMe: boolean
}

export interface EnterPasswordFormProps {
  onSubmit: (password: string, rememberMe: boolean) => Promise<any>
  contestInfo: ContestInfo
}

class EnterPasswordForm extends React.Component<EnterPasswordFormProps, {}> {
  initialValue: EnterPasswordFormValue = {
    password: '',
    rememberMe: false,
  }

  validationSchema = yup.object().shape({
    password: yup
      .string()
      .min(4)
      .max(255)
      .label('Password')
      .required(),
    rememberMe: yup.boolean().required(),
  })

  handleSubmit = async (
    values: EnterPasswordFormValue,
    { setSubmitting }: FormikActions<EnterPasswordFormValue>
  ) => {
    try {
      await this.props.onSubmit(values.password, values.rememberMe)
    } finally {
      setSubmitting(false)
    }
  }

  render() {
    const renderView = (props: FormikProps<EnterPasswordFormValue>) => (
      <EnterPasswordFormView {...props} contestInfo={this.props.contestInfo} />
    )
    return (
      <Formik
        initialValues={this.initialValue}
        validationSchema={this.validationSchema}
        onSubmit={this.handleSubmit}
        render={renderView}
      />
    )
  }
}

export default compose<ComponentType<EnterPasswordFormProps>>(publicOnly())(
  EnterPasswordForm
)
