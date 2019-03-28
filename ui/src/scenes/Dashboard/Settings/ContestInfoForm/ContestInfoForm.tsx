import { useContest } from '@/app'
import { showErrorToast, showSuccessToast, useContestOnly } from '@/common'
import { Formik, FormikActions, FormikProps } from 'formik'
import { useObserver } from 'mobx-react-lite'
import React, { FunctionComponent, useEffect } from 'react'
import * as yup from 'yup'
import { SimpleLoading } from '../../components/SimpleLoading'
import { ContestInfoFormView } from './ContestInfoFormView'

export interface ContestInfoFormValue {
  name: string
  shortDescription: string
  description: string
  startTime: Date
  finishTime: Date
  freezed: boolean
  permittedLanguages: string[]
}

export const ContestInfoForm: FunctionComponent = () => {
  useContestOnly()
  const contestStore = useContest()

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .label('Contest Name')
      .min(4)
      .max(255)
      .required(),
    shortDescription: yup
      .string()
      .label('Contest Short Description')
      .min(4)
      .max(255)
      .required(),
    description: yup
      .string()
      .label('Contest Description')
      .required(),
    startTime: yup
      .date()
      .label('Contest Starting Time')
      .required(),
    finishTime: yup
      .date()
      .label('Contest Finish Time')
      .min(yup.ref('startTime'))
      .required(),
    freezed: yup.bool(),
    permittedLanguages: yup
      .array()
      .of(yup.string())
      .label('Permitted Languages')
      .required(),
  })

  const handleSubmit = async (values: ContestInfoFormValue, { setSubmitting }: FormikActions<ContestInfoFormValue>) => {
    try {
      await contestStore.update(
        values.name,
        values.shortDescription,
        values.description,
        values.startTime,
        values.freezed,
        values.finishTime,
        values.permittedLanguages
      )
      showSuccessToast('Contest Updated')
    } catch (error) {
      showErrorToast(error)
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    contestStore.loadLanguages()
  }, [])

  return useObserver(() => {
    const contest = contestStore.current
    const initialValue: ContestInfoFormValue = {
      name: contest ? contest.name : '',
      shortDescription: contest ? contest.shortDescription : '',
      description: contest ? contest.description : '',
      startTime: contest ? contest.startTime : new Date(Date.now() + 60 * 60 * 1000 * 24 * 10),
      finishTime: contest ? contest.finishTime : new Date(Date.now() + 60 * 60 * 1000 * (24 * 10 + 5)),
      freezed: contest ? contest.freezed : false,
      permittedLanguages: contest ? contest.permittedLanguages.map(l => l.id) : [],
    }

    const availableLanguages = contestStore.languages
    if (!contest || !availableLanguages) return <SimpleLoading />
    const renderForm = (props: FormikProps<ContestInfoFormValue>) => (
      <ContestInfoFormView availableLanguages={availableLanguages} {...props} />
    )
    return (
      <Formik
        initialValues={initialValue}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        render={renderForm}
      />
    )
  })
}
