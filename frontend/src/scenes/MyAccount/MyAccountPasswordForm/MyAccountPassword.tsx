import { Formik, FormikActions } from 'formik'
import React, { ComponentType } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import * as yup from 'yup'

import ActionToaster from '../../../helpers/ActionToaster'
import { contestOnly } from '../../../helpers/auth'
import { AuthError } from '../../../services/auth'
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

  handleSubmit = async (
    values: MyAccountPasswordFormValue,
    { setSubmitting, resetForm }: FormikActions<MyAccountPasswordFormValue>
  ) => {
    try {
      await this.props.dispatch(
        setPassword(values.oldPassword, values.newPassword)
      )
      ActionToaster.showSuccessToast('Password Changed')
    } catch (error) {
      if (error instanceof AuthError) ActionToaster.showErrorToast(error)
      else throw error
    } finally {
      setSubmitting(false)
      resetForm()
    }
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

export default compose<ComponentType>(
  contestOnly(),
  connect()
)(MyAccountPassword as any)
