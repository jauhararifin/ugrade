import { Formik, FormikActions, FormikProps } from 'formik'
import React, { FunctionComponent, useEffect } from 'react'
import { usePublicOnly, useSetMeByEmail } from 'ugrade/auth'
import { TopToaster } from 'ugrade/common/ActionToaster'
import { useContestInfo } from 'ugrade/contest'
import { ContestInfo } from 'ugrade/contest/store'
import { useReset } from 'ugrade/scenes/EnterContest'
import { AuthError } from 'ugrade/services/auth'
import { AppThunkDispatch } from 'ugrade/store'
import * as yup from 'yup'
import { EnterEmailFormView } from './EnterEmailFormView'

export interface EnterEmailFormValue {
  email: string
}

export interface EnterEmailFormProps {
  contest?: ContestInfo
  dispatch: AppThunkDispatch
}

export const EnterEmailForm: FunctionComponent = () => {
  usePublicOnly()

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

  const setEmail = useSetMeByEmail()

  const handleSubmit = async (
    values: EnterEmailFormValue,
    { setSubmitting }: FormikActions<EnterEmailFormValue>
  ) => {
    try {
      await setEmail(values.email)
    } catch (error) {
      if (error instanceof AuthError) TopToaster.showErrorToast(error)
      else throw error
    } finally {
      setSubmitting(false)
    }
  }

  const contestInfo = useContestInfo()
  const resetContest = useReset()

  useEffect(() => {
    if (!contestInfo) resetContest()
  }, [])

  if (!contestInfo) return <React.Fragment />

  const renderView = (props: FormikProps<EnterEmailFormValue>) => (
    <EnterEmailFormView
      contest={contestInfo}
      gotoAnotherContest={resetContest}
      {...props}
    />
  )
  return (
    <Formik
      initialValues={initialValue}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      render={renderView}
    />
  )
}
