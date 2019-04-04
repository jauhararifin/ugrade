import { useContestOnly } from '@/auth'
import { BasicError } from '@/components/BasicError/BasicError'
import { showError } from '@/error'
import { showSuccessToast } from '@/toaster'
import { Formik, FormikActions, FormikProps } from 'formik'
import gql from 'graphql-tag'
import React, { FunctionComponent } from 'react'
import { useMutation, useQuery } from 'react-apollo-hooks'
import * as yup from 'yup'
import { SimpleLoading } from '../../components/SimpleLoading'
import { useBreadcrumb } from '../../TopNavigationBar/Breadcrumbs/Breadcrumbs'
import { ContestInfoFormView } from './ContestInfoFormView'
import { GetMyContestDetail } from './types/GetMyContestDetail'

export interface ContestInfoFormValue {
  name: string
  shortDescription: string
  description: string
  startTime: Date
  finishTime: Date
  freezed: boolean
  permittedLanguages: string[]
  gradingSize: number
}

export const ContestInfoForm: FunctionComponent = () => {
  useContestOnly()

  useBreadcrumb(`/contest/settings`, 'Settings')

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
    gradingSize: yup
      .number()
      .integer()
      .positive()
      .required(),
  })

  const updateContestMutate = useMutation(gql`
    mutation UpdateContestDetail($contest: UpdateContestInput!) {
      updateContest(contest: $contest) {
        id
        name
        shortDescription
        description
        startTime
        finishTime
        freezed
        permittedLanguages {
          id
          name
        }
        gradingSize
      }
    }
  `)

  const handleSubmit = async (values: ContestInfoFormValue, { setSubmitting }: FormikActions<ContestInfoFormValue>) => {
    try {
      await updateContestMutate({
        variables: {
          contest: values,
        },
      })
      showSuccessToast('Contest Updated')
    } catch (error) {
      showError(error)
    } finally {
      setSubmitting(false)
    }
  }

  const { data, loading, error } = useQuery<GetMyContestDetail>(gql`
    query GetMyContestDetail {
      myContest {
        id
        name
        shortDescription
        description
        startTime
        finishTime
        freezed
        permittedLanguages {
          id
          name
        }
        gradingSize
      }
    }
  `)

  if (error) return <BasicError />
  if (loading) return <SimpleLoading />
  if (!data) return <BasicError />

  const contest = data.myContest
  contest.startTime = new Date(contest.startTime)
  contest.finishTime = new Date(contest.finishTime)
  const initialValue: ContestInfoFormValue = {
    name: contest ? contest.name : '',
    shortDescription: contest ? contest.shortDescription : '',
    description: contest ? contest.description : '',
    startTime: contest ? contest.startTime : new Date(Date.now() + 60 * 60 * 1000 * 24 * 10),
    finishTime: contest ? contest.finishTime : new Date(Date.now() + 60 * 60 * 1000 * (24 * 10 + 5)),
    freezed: contest ? contest.freezed : false,
    permittedLanguages: contest ? contest.permittedLanguages.map(l => l.id) : [],
    gradingSize: contest.gradingSize ? contest.gradingSize : 1,
  }

  const availableLanguages = contest.permittedLanguages
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
}
