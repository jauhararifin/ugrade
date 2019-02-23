import { Formik, FormikActions, FormikProps } from 'formik'
import React, { ComponentType } from 'react'
import { compose } from 'redux'
import * as yup from 'yup'

import { publicOnly } from '../../../helpers/auth'
import { ContestInfo } from '../../../stores/Contest'
import EnterUserFormView from './EnterUserFormView'

export interface EnterUserFormValue {
  email: string
}

export interface EnterUserFormProps {
  onSubmit: (email: string) => Promise<any>
  contestInfo: ContestInfo
}

class EnterUserForm extends React.Component<EnterUserFormProps, {}> {
  initialValue: EnterUserFormValue = {
    email: '',
  }

  validationSchema = yup.object().shape({
    usernameOrEmail: yup
      .string()
      .min(4)
      .max(255)
      .email()
      .label('Email')
      .required(),
  })

  handleSubmit = async (
    values: EnterUserFormValue,
    { setSubmitting }: FormikActions<EnterUserFormValue>
  ) => {
    try {
      await this.props.onSubmit(values.email)
    } finally {
      setSubmitting(false)
    }
  }

  render() {
    const renderView = (props: FormikProps<EnterUserFormValue>) => (
      <EnterUserFormView {...props} contestInfo={this.props.contestInfo} />
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

export default compose<ComponentType<EnterUserFormProps>>(publicOnly())(
  EnterUserForm
)
