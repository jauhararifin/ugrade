import { Formik, FormikActions, FormikProps } from 'formik'
import React, { ComponentType, Fragment, FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import * as yup from 'yup'

import ActionToaster from '../../../../helpers/ActionToaster'
import { withServer, WithServerProps } from '../../../../helpers/server'
import { ContestError } from '../../../../services/contest/errors'
import { AppState, AppThunkDispatch } from '../../../../stores'
import { ContestState } from '../../../../stores/Contest'
import { useInfo, useProblems } from '../../helpers'
import { submitSolutionAction } from './actions'
import ContestSubmitFormView from './ContestSubmitFormView'

export interface ContestSubmitFormValue {
  language: string
  problem: string
  sourceCode: string
}

export interface ContestSubmitFormReduxProps {
  dispatch: AppThunkDispatch
  contest: ContestState
}

export type ContestSubmitFormProps = ContestSubmitFormReduxProps &
  WithServerProps

export const ContestSubmitForm: FunctionComponent<ContestSubmitFormProps> = ({
  dispatch,
  contest,
  serverClock,
}) => {
  useInfo(dispatch)
  useProblems(dispatch)

  const validationSchema = yup.object().shape({
    language: yup.string().required(),
    problem: yup.string().required(),
    sourceCode: yup
      .string()
      .url()
      .required(),
  })

  const getInitialValue = () => {
    const langs = contest.info && contest.info.permittedLanguages
    const probs = contest.problems
    const prob =
      probs &&
      Object.values(probs)
        .sort((a, b) => a.order - b.order)
        .shift()
    return {
      language: langs && langs.length > 0 ? langs[0].id : '',
      problem: prob ? prob.id : '',
      sourceCode:
        'https://raw.githubusercontent.com/jauhararifin/cp/master/uva/820.cpp',
    }
  }

  const handleSubmit = async (
    values: ContestSubmitFormValue,
    { setSubmitting, resetForm }: FormikActions<ContestSubmitFormValue>
  ) => {
    try {
      await dispatch(
        submitSolutionAction(values.problem, values.language, values.sourceCode)
      )
      ActionToaster.showSuccessToast('Solution Submitted')
    } catch (error) {
      if (error instanceof ContestError) ActionToaster.showErrorToast(error)
      else throw error
    } finally {
      setSubmitting(false)
      resetForm()
    }
  }

  const getProblems = ():
    | Array<{ label: string; value: string }>
    | undefined => {
    if (!contest.problems) return undefined
    const problems = Object.values(contest.problems)
    return problems
      .sort((a, b) => a.order - b.order)
      .map(problem => ({
        label: problem.name,
        value: problem.id,
      }))
  }

  const getLanguages = ():
    | Array<{ label: string; value: string }>
    | undefined => {
    const info = contest.info
    if (info) {
      const languages = info.permittedLanguages
      return languages.map(lang => ({
        label: lang.name,
        value: lang.id,
      }))
    }
    return undefined
  }

  const renderView = (props: FormikProps<ContestSubmitFormValue>) => (
    <ContestSubmitFormView
      avaiableLanguages={getLanguages()}
      avaiableProblems={getProblems()}
      {...props}
    />
  )

  const started =
    serverClock && contest.info && serverClock >= contest.info.startTime
  const ended =
    serverClock && contest.info && serverClock >= contest.info.finishTime

  if (started && !ended) {
    return (
      <Formik
        initialValues={getInitialValue()}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        render={renderView}
      />
    )
  }
  return <Fragment />
}

const mapStateToProps = (state: AppState) => ({
  contest: state.contest,
})

export default compose<ComponentType>(
  withServer,
  connect(mapStateToProps)
)(ContestSubmitForm)
