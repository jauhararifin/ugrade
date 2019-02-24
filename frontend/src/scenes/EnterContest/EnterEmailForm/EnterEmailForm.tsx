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
  onSubmit: (
    values: EnterEmailFormValue,
    { setSubmitting }: FormikActions<EnterEmailFormValue>
  ) => any
  contestInfo: ContestInfo
  gotoAnotherContest: () => any
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

  render() {
    const renderView = (props: FormikProps<EnterEmailFormValue>) => (
      <EnterEmailFormView
        contestInfo={this.props.contestInfo}
        gotoAnotherContest={this.props.gotoAnotherContest}
        {...props}
      />
    )
    return (
      <Formik
        initialValues={this.initialValue}
        validationSchema={this.validationSchema}
        onSubmit={this.props.onSubmit}
        render={renderView}
      />
    )
  }
}

export default compose<ComponentType<EnterEmailFormProps>>(publicOnly())(
  EnterEmailForm
)
