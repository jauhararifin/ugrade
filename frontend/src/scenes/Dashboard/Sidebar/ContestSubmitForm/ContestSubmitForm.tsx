import { Formik, FormikActions, FormikProps } from 'formik'
import React, { ComponentType, Fragment, FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { handleCommonError } from 'ugrade/common'
import { TopToaster } from 'ugrade/common/ActionToaster'
import {
  ContestInfo,
  getProblemList,
  Language,
  Problem,
} from 'ugrade/contest/store'
import { withServer, WithServerProps } from 'ugrade/helpers/server'
import { AppState, AppThunkDispatch } from 'ugrade/store'
import * as yup from 'yup'
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
  problems?: Problem[]
  languages?: Language[]
  info?: ContestInfo
}

export type ContestSubmitFormProps = ContestSubmitFormReduxProps &
  WithServerProps

export const ContestSubmitForm: FunctionComponent<ContestSubmitFormProps> = ({
  dispatch,
  problems,
  languages,
  info,
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
    return {
      language: languages && languages.length > 0 ? languages[0].id : '',
      problem: problems && problems.length > 0 ? problems[0].id : '',
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

  const renderView = (props: FormikProps<ContestSubmitFormValue>) => (
    <ContestSubmitFormView
      avaiableLanguages={getLanguages()}
      avaiableProblems={getProblems()}
      {...props}
    />
  )

  const started = serverClock && info && serverClock >= info.startTime
  const ended = serverClock && info && serverClock >= info.finishTime

  if (languages && problems && started && !ended) {
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
  info: state.contest.info,
  problems: getProblemList(state),
  languages: state.contest.info
    ? state.contest.info.permittedLanguages
    : undefined,
})

export default compose<ComponentType>(
  withServer,
  connect(mapStateToProps)
)(ContestSubmitForm)
