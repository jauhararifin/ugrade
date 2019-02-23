import { Formik, FormikActions, FormikProps } from 'formik'
import React, { ComponentType } from 'react'
import { compose } from 'redux'
import * as yup from 'yup'

import { publicOnly } from '../../../helpers/auth'
import { ContestInfo } from '../../../stores/Contest'
import EnterEmailFormView from './EnterEmailFormView'

export interface EnterEmailFormValue {
  email: string
}

export interface EnterEmailFormProps {
  onSubmit: (email: string) => Promise<any>
  contestInfo: ContestInfo
}

class EnterEmailForm extends React.Component<EnterEmailFormProps> {
  initialValue: EnterEmailFormValue = {
    email: '',
  }

  validationSchema = yup.object().shape({
    email: yup
      .string()
      .min(4)
      .max(255)
      .email()
      .label('Email')
      .required(),
  })

  handleSubmit = async (
    values: EnterEmailFormValue,
    { setSubmitting }: FormikActions<EnterEmailFormValue>
  ) => {
    try {
      await this.props.onSubmit(values.email)
    } finally {
      setSubmitting(false)
    }
  }

  render() {
    const renderView = (props: FormikProps<EnterEmailFormValue>) => (
      <EnterEmailFormView contestInfo={this.props.contestInfo} {...props} />
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

export default compose<ComponentType<EnterEmailFormProps>>(publicOnly())(
  EnterEmailForm
)
