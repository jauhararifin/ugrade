import { Formik, FormikActions } from 'formik'
import React, { FunctionComponent } from 'react'
import { useSetPassword } from 'ugrade/auth'
import { handleCommonError } from 'ugrade/common'
import { TopToaster } from 'ugrade/common/ActionToaster'
import * as yup from 'yup'
import { MyAccountPasswordFormView } from './MyAccountPasswordFormView'

export interface MyAccountPasswordFormValue {
  oldPassword: string
  newPassword: string
  confirmation: string
}

export const MyAccountPasswordForm: FunctionComponent = () => {
  const initialValues: MyAccountPasswordFormValue = {
    oldPassword: '',
    newPassword: '',
    confirmation: '',
  }

  const validationSchema = yup.object().shape({
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

  const setPassword = useSetPassword()

  const handleSubmit = async (
    values: MyAccountPasswordFormValue,
    { setSubmitting, resetForm }: FormikActions<MyAccountPasswordFormValue>
  ) => {
    try {
      await setPassword(values.oldPassword, values.newPassword)
      TopToaster.showSuccessToast('Password Changed')
    } catch (error) {
      if (!handleCommonError(error)) throw error
    } finally {
      setSubmitting(false)
      resetForm()
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      render={MyAccountPasswordFormView}
    />
  )
}
