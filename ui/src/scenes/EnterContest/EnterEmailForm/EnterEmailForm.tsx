import { Formik, FormikActions, FormikProps } from 'formik'
import React, { FunctionComponent, useEffect } from 'react'
import * as yup from 'yup'
import { useAuth, useContest, useRouting } from '../../../app'
import { showAlertToast, showErrorToast } from '../../../common'
import { useReset } from '../reset'
import { EnterEmailFormView } from './EnterEmailFormView'

export interface EnterEmailFormValue {
  email: string
}

export const EnterEmailForm: FunctionComponent = () => {
  const initialValue: EnterEmailFormValue = {
    email: '',
  }

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .min(4)
      .max(255)
      .email()
      .label('Email')
      .required(),
  })

  const routingStore = useRouting()
  const contestStore = useContest()
  const authStore = useAuth()

  const handleSubmit = async (values: EnterEmailFormValue, { setSubmitting }: FormikActions<EnterEmailFormValue>) => {
    try {
      if (!contestStore.current) {
        showAlertToast('Please Set The Contest First')
      } else {
        const user = await authStore.setMeByEmail(contestStore.current.id, values.email)
        if (user.username) {
          routingStore.push('/enter-contest/enter-password')
        } else {
          routingStore.push('/enter-contest/signup')
        }
      }
    } catch (error) {
      showErrorToast(error)
    } finally {
      setSubmitting(false)
    }
  }

  const resetContest = useReset()
  useEffect(() => {
    if (!contestStore.current) resetContest()
  }, [])

  const renderView = (props: FormikProps<EnterEmailFormValue>) => {
    if (!contestStore.current) return <React.Fragment />
    return <EnterEmailFormView contest={contestStore.current} gotoAnotherContest={resetContest} {...props} />
  }
  return (
    <Formik
      initialValues={initialValue}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      render={renderView}
    />
  )
}
