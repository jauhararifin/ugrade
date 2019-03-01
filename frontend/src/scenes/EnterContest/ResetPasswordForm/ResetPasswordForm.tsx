import { Formik, FormikActions, FormikProps } from 'formik'
import React, { ComponentType } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import ActionToaster from 'ugrade/helpers/ActionToaster/ActionToaster'
import { publicOnly } from 'ugrade/helpers/auth'
import { AuthError } from 'ugrade/services/auth'
import { AppState, AppThunkDispatch } from 'ugrade/store'
import { ContestInfo } from 'ugrade/stores/Contest'
import * as yup from 'yup'
import { resetAccountAction, resetAction } from '../actions'
import { resetPasswordAction } from './actions'
import { ResetPasswordFormValue } from './ResetPasswordForm'
import { ResetPasswordFormView } from './ResetPasswordFormView'

import './styles.css'

export interface ResetPasswordFormValue {
  oneTimeCode: string
  password: string
}

export interface ResetPasswordFormProps {
  dispatch: AppThunkDispatch
  contest: ContestInfo
}

class ResetPasswordForm extends React.Component<ResetPasswordFormProps> {
  initialValues = {
    oneTimeCode: '',
    password: '',
  }

  validationSchema = yup.object().shape({
    oneTimeCode: yup
      .string()
      .label('One Time Code')
      .matches(/.{8}/, 'Invalid One Time Code')
      .required(),
    password: yup
      .string()
      .min(8)
      .max(255)
      .required(),
  })

  handleSubmit = async (
    values: ResetPasswordFormValue,
    { setSubmitting }: FormikActions<ResetPasswordFormValue>
  ) => {
    try {
      await this.props.dispatch(
        resetPasswordAction(values.oneTimeCode, values.password)
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

  render() {
    const contest = this.props.contest
    if (!contest) return <React.Fragment />

    const renderView = (props: FormikProps<ResetPasswordFormValue>) => (
      <ResetPasswordFormView
        {...props}
        contest={contest}
        gotoAnotherContest={this.props.dispatch.bind(this, resetAction())}
        gotoAnotherAccount={this.props.dispatch.bind(
          this,
          resetAccountAction()
        )}
      />
    )
    return (
      <Formik
        validationSchema={this.validationSchema}
        onSubmit={this.handleSubmit}
        initialValues={this.initialValues}
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
)(ResetPasswordForm)
