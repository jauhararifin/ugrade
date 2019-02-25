import { Formik, FormikActions, FormikProps } from 'formik'
import React, { Component, ComponentType } from 'react'
import * as yup from 'yup'

import { connect } from 'react-redux'
import { compose } from 'redux'
import ActionToaster from '../../../../helpers/ActionToaster'
import { ContestError } from '../../../../services/contest/errors'
import { AppState, AppThunkDispatch } from '../../../../stores'
import { ContestState } from '../../../../stores/Contest'
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

export type ContestSubmitFormProps = ContestSubmitFormReduxProps

export class ContestSubmitForm extends Component<ContestSubmitFormProps> {
  validationSchema = yup.object().shape({
    language: yup.string().required(),
    problem: yup.string().required(),
    sourceCode: yup
      .string()
      .url()
      .required(),
  })

  getInitialValue = () => {
    const langs =
      this.props.contest.info && this.props.contest.info.permittedLanguages
    const probs = this.props.contest.problems
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

  handleSubmit = async (
    values: ContestSubmitFormValue,
    { setSubmitting, resetForm }: FormikActions<ContestSubmitFormValue>
  ) => {
    try {
      const { dispatch } = this.props
      await dispatch(
        submitSolutionAction(values.problem, values.language, values.sourceCode)
      ).then(() => ActionToaster.showSuccessToast('Solution Submitted'))
    } catch (error) {
      if (error instanceof ContestError) ActionToaster.showErrorToast(error)
      else throw error
    } finally {
      setSubmitting(false)
      resetForm()
    }
  }

  getProblems = (): Array<{ label: string; value: string }> => {
    const problems = Object.values(this.props.contest.problems || {})
    return problems
      .sort((a, b) => a.order - b.order)
      .map(problem => ({
        label: problem.name,
        value: problem.id,
      }))
  }

  getLanguages = (): Array<{ label: string; value: string }> => {
    const info = this.props.contest.info
    if (info) {
      const languages = info.permittedLanguages || []
      return languages.map(lang => ({
        label: lang.name,
        value: lang.id,
      }))
    }
    return []
  }

  render() {
    const renderView = (props: FormikProps<ContestSubmitFormValue>) => (
      <ContestSubmitFormView
        avaiableLanguages={this.getLanguages()}
        avaiableProblems={this.getProblems()}
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

const mapStateToProps = (state: AppState) => ({
  contest: state.contest,
})

export default compose<ComponentType>(connect(mapStateToProps))(
  ContestSubmitForm
)
