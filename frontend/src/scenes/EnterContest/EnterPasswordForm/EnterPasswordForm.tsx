import { Formik, FormikActions, FormikProps } from 'formik'
import React, { ComponentType } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import * as yup from 'yup'

import ActionToaster from '../../../helpers/ActionToaster/ActionToaster'
import { publicOnly } from '../../../helpers/auth'
import { AuthError } from '../../../services/auth'
import { AppState, AppThunkDispatch } from '../../../stores'
import { ContestInfo } from '../../../stores/Contest'
import { resetAccountAction, resetAction } from '../actions'
import { forgotPasswordAction, signinAction } from './actions'
import EnterPasswordFormView from './EnterPasswordFormView'

export interface EnterPasswordFormValue {
  password: string
  rememberMe: boolean
}

export interface EnterPasswordFormProps {
  contest?: ContestInfo
  dispatch: AppThunkDispatch
  gotoAnotherContest: () => any
  forgotPassword: (setSubmitting: (val: boolean) => void) => any
}

class EnterPasswordForm extends React.Component<EnterPasswordFormProps, {}> {
  initialValue: EnterPasswordFormValue = {
    password: '',
    rememberMe: false,
  }

  validationSchema = yup.object().shape({
    password: yup
      .string()
      .min(4)
      .max(255)
      .label('Password')
      .required(),
    rememberMe: yup.boolean().required(),
  })

  handleSubmit = async (
    values: EnterPasswordFormValue,
    { setSubmitting }: FormikActions<EnterPasswordFormValue>
  ) => {
    try {
      await this.props.dispatch(
        signinAction(values.password, values.rememberMe)
      )
    } catch (error) {
      if (error instanceof AuthError) ActionToaster.showErrorToast(error)
      else throw error
    } finally {
      setSubmitting(false)
    }
  }

  componentDidMount() {
    if (!this.props.contest) this.props.dispatch(resetAction())
  }

  handleForgotPassword = async (setSubmitting: (val: boolean) => void) => {
    try {
      await this.props.dispatch(forgotPasswordAction())
    } catch (error) {
      if (error instanceof AuthError) ActionToaster.showErrorToast(error)
      else throw error
    } finally {
      setSubmitting(false)
    }
  }

  render() {
    const contest = this.props.contest
    if (!contest) return <React.Fragment />

    const renderView = (props: FormikProps<EnterPasswordFormValue>) => (
      <EnterPasswordFormView
        {...props}
        contest={contest}
        gotoAnotherContest={this.props.dispatch.bind(this, resetAction())}
        gotoAnotherAccount={this.props.dispatch.bind(
          this,
          resetAccountAction()
        )}
        forgotPassword={this.handleForgotPassword}
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

const mapStateToProps = (state: AppState) => ({
  contest: state.contest.info,
})

export default compose<ComponentType>(
  publicOnly(),
  connect(mapStateToProps)
)(EnterPasswordForm)
