import { Formik, FormikActions, FormikProps } from 'formik'
import lodash from 'lodash'
import { useObserver } from 'mobx-react-lite'
import React, { FunctionComponent } from 'react'
import * as yup from 'yup'
import { useContest, useProblem, useSubmission } from '../../../../app'
import { showErrorToast, showSuccessToast, useContestOnly } from '../../../../common'
import { ContestSubmitFormLoadingView } from './ContestSubmitFormLoadingView'
import { ContestSubmitFormView } from './ContestSubmitFormView'

export interface ContestSubmitFormValue {
  language: string
  problem: string
  sourceCode: File
}

export const ContestSubmitForm: FunctionComponent = () => {
  useContestOnly()
  const contestStore = useContest()
  const problemStore = useProblem()
  const submissionStore = useSubmission()

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

  const handleSubmit = async (
    values: ContestSubmitFormValue,
    { setSubmitting, resetForm }: FormikActions<ContestSubmitFormValue>
  ) => {
    try {
      await submissionStore.submit(values.problem, values.language, values.sourceCode)
      showSuccessToast('Solution Submitted')
    } catch (error) {
      showErrorToast(error)
    } finally {
      setSubmitting(false)
      resetForm()
    }
  }

  return useObserver(() => {
    const contestInfo = contestStore.current
    const problems = lodash.values(problemStore.problems)
    const languages = contestInfo ? contestInfo.permittedLanguages : undefined

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
  })
}
