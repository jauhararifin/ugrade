import { Formik, FormikActions, FormikProps } from 'formik'
import React, { FunctionComponent, useEffect } from 'react'
import { usePublicOnly } from 'ugrade/auth'
import { globalErrorCatcher, handleCommonError } from 'ugrade/common'
import { ContestInfo } from 'ugrade/contest/store'
import { useReset } from 'ugrade/scenes/EnterContest'
import { AppThunkDispatch } from 'ugrade/store'
import * as yup from 'yup'
import { useCurrentContestInfo, useSetMeByEmail } from '../actions'
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

  const handleSubmit = async (values: EnterEmailFormValue, { setSubmitting }: FormikActions<EnterEmailFormValue>) => {
    try {
      await setEmail(values.email)
    } catch (error) {
      if (!handleCommonError(error)) globalErrorCatcher(error)
    } finally {
      setSubmitting(false)
    }
  }

  const contestInfo = useCurrentContestInfo()
  const resetContest = useReset()

  useEffect(() => {
    if (!contestInfo) resetContest()
  }, [])

  if (!contestInfo) return <React.Fragment />

  const renderView = (props: FormikProps<EnterEmailFormValue>) => (
    <EnterEmailFormView contest={contestInfo} gotoAnotherContest={resetContest} {...props} />
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
