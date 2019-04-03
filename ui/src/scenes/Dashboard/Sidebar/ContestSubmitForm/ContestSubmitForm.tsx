import { useContestOnly } from '@/auth'
import { showError } from '@/error'
import { showSuccessToast } from '@/toaster'
import { Formik, FormikActions, FormikProps } from 'formik'
import gql from 'graphql-tag'
import React, { FunctionComponent } from 'react'
import { useQuery } from 'react-apollo-hooks'
import * as yup from 'yup'
import { useSubmitSolution } from './action'
import { ContestSubmitFormLoadingView } from './ContestSubmitFormLoadingView'
import { ContestSubmitFormView } from './ContestSubmitFormView'
import { GetMyContest } from './types/GetMyContest'

export interface ContestSubmitFormValue {
  language: string
  problem: string
  sourceCode: File
}

export const ContestSubmitForm: FunctionComponent = () => {
  useContestOnly()

  const validationSchema = yup.object().shape({
    language: yup
      .string()
      .label('Language')
      .required(),
    problem: yup
      .string()
      .label('Problem')
      .required(),
    sourceCode: yup.mixed(),
  })

  const submitSolution = useSubmitSolution()
  const handleSubmit = async (
    values: ContestSubmitFormValue,
    { setSubmitting, resetForm }: FormikActions<ContestSubmitFormValue>
  ) => {
    try {
      await submitSolution(values.problem, values.language, values.sourceCode)
      showSuccessToast('Solution Submitted')
    } catch (error) {
      showError(error)
    } finally {
      setSubmitting(false)
      resetForm()
    }
  }

  const { data, loading, error } = useQuery<GetMyContest>(gql`
    query GetMyContest {
      myContest {
        problems {
          id
          name
        }
        permittedLanguages {
          id
          name
          extensions
        }
      }
    }
  `)

  if (error) return null
  if (loading) return <ContestSubmitFormLoadingView />

  const problems = data ? data.myContest.problems : []
  const languages = data ? data.myContest.permittedLanguages : []

  const getInitialValue = (): ContestSubmitFormValue => {
    return {
      language: languages && languages.length > 0 ? languages[0].id : '',
      problem: problems && problems.length > 0 ? problems[0].id : '',
      sourceCode: new File([], ''),
    }
  }

  const getProblems = (): Array<{ label: string; value: string }> | undefined => {
    if (!problems) return undefined
    return problems.map(problem => ({
      label: problem.name,
      value: problem.id,
    }))
  }

  const getLanguages = (): Array<{ label: string; value: string }> | undefined => {
    if (languages) {
      return languages.map(lang => ({
        label: lang.name,
        value: lang.id,
      }))
    }
    return undefined
  }

  const availableLanguages = getLanguages()
  const availableProblems = getProblems()

  if (availableLanguages && availableProblems) {
    const renderView = (props: FormikProps<ContestSubmitFormValue>) => (
      <ContestSubmitFormView avaiableLanguages={availableLanguages} avaiableProblems={availableProblems} {...props} />
    )
    return (
      <Formik
        initialValues={getInitialValue()}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        render={renderView}
      />
    )
  }
  return <ContestSubmitFormLoadingView />
}
