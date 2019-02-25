import { push } from 'connected-react-router'
import { Formik, FormikActions, FormikProps } from 'formik'
import React, { ComponentType } from 'react'
import { compose } from 'redux'
import * as yup from 'yup'

import './styles.css'

import { connect } from 'react-redux'
import { publicOnly } from '../../../helpers/auth'
import ActionToaster from '../../../middlewares/ErrorToaster/ActionToaster'
import { AuthError } from '../../../services/auth'
import { AppState, AppThunkDispatch } from '../../../stores'
import { ContestInfo } from '../../../stores/Contest'
import { resetAccountAction, resetAction } from '../actions'
import { signupAction } from './actions'
import { SignUpFormValue } from './SignUpForm'
import { SignUpFormView } from './SignUpFormView'

export interface SignUpFormValue {
  username: string
  name: string
  oneTimeCode: string
  password: string
  rememberMe: boolean
}

export interface SignUpFormProps {
  dispatch: AppThunkDispatch
  contest: ContestInfo
}

class SignUpForm extends React.Component<SignUpFormProps> {
  initialValues = {
    username: '',
    name: '',
    oneTimeCode: '',
    password: '',
    rememberMe: false,
  }

  validationSchema = yup.object().shape({
    username: yup
      .string()
      .matches(
        /[a-zA-Z0-9\-]+/,
        'Should contain alphanumeric and dash character only'
      )
      .min(4)
      .max(255)
      .required(),
    name: yup
      .string()
      .min(4)
      .max(255)
      .required(),
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
    rememberMe: yup.boolean().required(),
  })

  componentDidMount() {
    if (!this.props.contest) this.props.dispatch(resetAction())
  }

  handleSubmit = async (
    values: SignUpFormValue,
    { setSubmitting }: FormikActions<SignUpFormValue>
  ) => {
    try {
      await this.props.dispatch(
        signupAction(
          values.username,
          values.oneTimeCode,
          values.password,
          values.name,
          values.rememberMe
        )
      )
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

    const renderView = (props: FormikProps<SignUpFormValue>) => (
      <SignUpFormView
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

export default compose<ComponentType<SignUpFormProps>>(
  publicOnly(),
  connect(mapStateToProps)
)(SignUpForm)
