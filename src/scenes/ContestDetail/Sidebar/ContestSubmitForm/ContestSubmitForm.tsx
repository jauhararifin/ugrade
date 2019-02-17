import { Formik, FormikActions, FormikProps } from 'formik'
import React, { Component, ComponentType } from 'react'
import * as yup from 'yup'

import { connect } from 'react-redux'
import { compose } from 'redux'
import ActionToaster from '../../../../middlewares/ErrorToaster/ActionToaster'
import { AppThunkDispatch } from '../../../../stores'
import { Contest, Problem } from '../../../../stores/Contest'
import { submitSolution } from './actions'
import ContestSubmitFormView from './ContestSubmitFormView'

export interface ContestSubmitFormValue {
  language: number
  problem: number
  sourceCode: string
}

export interface ContestSubmitFormOwnProps {
  contest: Contest
  problems: Problem[]
}

export interface ContestSubmitFormReduxProps {
  dispatch: AppThunkDispatch
}

export type ContestSubmitFormProps = ContestSubmitFormReduxProps &
  ContestSubmitFormOwnProps

export class ContestSubmitForm extends Component<ContestSubmitFormProps> {
  validationSchema = yup.object().shape({
    language: yup
      .number()
      .positive()
      .required(),
    problem: yup
      .number()
      .positive()
      .required(),
    sourceCode: yup
      .string()
      .url()
      .required(),
  })
  getInitialValue = () => {
    const langs = this.props.contest.permittedLanguages
    const probs = this.props.contest.problems
    return {
      language: langs && langs.length > 0 ? langs[0].id : 0,
      problem: probs && probs.length > 0 ? probs[0].id : 0,
      sourceCode:
        'https://raw.githubusercontent.com/jauhararifin/cp/master/uva/820.cpp',
    }
  }
  handleSubmit = (
    values: ContestSubmitFormValue,
    { setSubmitting, resetForm }: FormikActions<ContestSubmitFormValue>
  ) => {
    const { contest, dispatch } = this.props
    dispatch(
      submitSolution(
        Number(contest.id),
        Number(values.problem),
        Number(values.language),
        values.sourceCode
      )
    )
      .then(() => ActionToaster.showSuccessToast('Solution Submitted'))
      .finally(() => {
        setSubmitting(false)
        resetForm()
      })
      .catch(_ => null)
  }
  render() {
    const { problems, contest } = this.props
    const avaiableProblems = problems.map(problem => ({
      label: problem.name,
      value: problem.id,
    }))
    const avaiableLanguages = (contest.permittedLanguages || []).map(lang => ({
      value: lang.id,
      label: lang.name,
    }))
    const renderView = (props: FormikProps<ContestSubmitFormValue>) => (
      <ContestSubmitFormView
        avaiableLanguages={avaiableLanguages}
        avaiableProblems={avaiableProblems}
        {...props}
      />
    )
    return (
      <Formik
        initialValues={this.getInitialValue()}
        validationSchema={this.validationSchema}
        onSubmit={this.handleSubmit}
        render={renderView}
      />
    )
  }
}

export default compose<ComponentType<ContestSubmitFormOwnProps>>(connect())(
  ContestSubmitForm
)
