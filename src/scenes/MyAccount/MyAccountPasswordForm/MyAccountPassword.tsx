import { Formik, FormikActions } from 'formik'
import React from 'react'
import { connect } from 'react-redux'
import * as yup from 'yup'

import { AppThunkDispatch } from '../../../stores'
import { setPassword } from './actions'
import MyAccountPasswordFormView from './MyAccountPasswordFormView'

export interface MyAccountPasswordFormValue {
  oldPassword: string
  newPassword: string
  confirmation: string
}

export interface MyAccountPasswordProps {
  dispatch: AppThunkDispatch
}

export class MyAccountPassword extends React.Component<MyAccountPasswordProps> {
  validationSchema = yup.object().shape({
    oldPassword: yup
      .string()
      .required()
      .label('Old Password'),
    newPassword: yup
      .string()
      .required()
      .label('New Password'),
    confirmation: yup
      .string()
      .required()
      .label('Confirmation Password')
      .oneOf([yup.ref('newPassword'), null], "Passwords don't match"),
  })

  handleSubmit = (
    values: MyAccountPasswordFormValue,
    { setSubmitting, resetForm }: FormikActions<MyAccountPasswordFormValue>
  ) => {
    this.props
      .dispatch(setPassword(values.oldPassword, values.newPassword))
      .finally(() => {
        setSubmitting(false)
        resetForm()
      })
      .catch(_ => null)
  }

  render() {
    return (
      <Formik
        initialValues={{ oldPassword: '', newPassword: '', confirmation: '' }}
        onSubmit={this.handleSubmit}
        validationSchema={this.validationSchema}
        render={MyAccountPasswordFormView}
      />
    )
  }
}

export default connect()(MyAccountPassword as any)
