import { Formik, FormikActions, FormikProps } from 'formik'
import React, { FunctionComponent } from 'react'
import { useContestOnly } from 'ugrade/auth'
import { handleCommonError } from 'ugrade/common'
import { TopToaster } from 'ugrade/common/ActionToaster'
import { useContestInfo } from 'ugrade/contest'
import { useProblemList } from 'ugrade/contest/problem'
import { useSubmitSolution } from 'ugrade/contest/submission'
import * as yup from 'yup'
import { ContestSubmitFormLoadingView } from './ContestSubmitFormLoadingView'
import { ContestSubmitFormView } from './ContestSubmitFormView'

export interface ContestSubmitFormValue {
  language: string
  problem: string
  sourceCode: string
}

export const ContestSubmitForm: FunctionComponent = () => {
  useContestOnly()
  const contestInfo = useContestInfo()
  const problems = useProblemList()
  const languages = contestInfo ? contestInfo.permittedLanguages : undefined

  const validationSchema = yup.object().shape({
    language: yup
      .string()
      .label('Language')
      .required(),
    problem: yup
      .string()
      .label('Problem')
      .required(),
    sourceCode: yup
      .string()
      .label('Source Code')
      .url()
      .required(),
  })

  const getInitialValue = () => {
    return {
      language: languages && languages.length > 0 ? languages[0].id : '',
      problem: problems && problems.length > 0 ? problems[0].id : '',
      sourceCode:
        'https://raw.githubusercontent.com/jauhararifin/cp/master/uva/820.cpp',
    }
  }

  const submitSolution = useSubmitSolution()

  const handleSubmit = async (
    values: ContestSubmitFormValue,
    { setSubmitting, resetForm }: FormikActions<ContestSubmitFormValue>
  ) => {
    try {
      await submitSolution(values.problem, values.language, values.sourceCode)
      TopToaster.showSuccessToast('Solution Submitted')
    } catch (error) {
      if (!handleCommonError(error)) throw error
    } finally {
      setSubmitting(false)
      resetForm()
    }
  }

  const getProblems = ():
    | Array<{ label: string; value: string }>
    | undefined => {
    if (!problems) return undefined
    return problems.map(problem => ({
      label: problem.name,
      value: problem.id,
    }))
  }

  const getLanguages = ():
    | Array<{ label: string; value: string }>
    | undefined => {
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
      <ContestSubmitFormView
        avaiableLanguages={availableLanguages}
        avaiableProblems={availableProblems}
        {...props}
      />
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
