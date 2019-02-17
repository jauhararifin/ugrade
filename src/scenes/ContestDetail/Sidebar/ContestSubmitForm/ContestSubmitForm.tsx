import { Formik, FormikActions, FormikProps } from 'formik'
import React, { Component, ComponentType } from 'react'
import * as yup from 'yup'

import { connect } from 'react-redux'
import { compose } from 'redux'
import { AppThunkDispatch } from '../../../../stores'
import { Contest, Problem } from '../../../../stores/Contest'
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
  initialValue = {
    language: 0,
    problem: 0,
    sourceCode: '',
  }
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
  handleSubmit = (
    values: ContestSubmitFormValue,
    { setSubmitting, resetForm }: FormikActions<ContestSubmitFormValue>
  ) => {
    setSubmitting(false)
    resetForm()
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
        initialValues={this.initialValue}
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
