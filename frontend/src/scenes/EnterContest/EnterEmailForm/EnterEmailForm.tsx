import { push } from 'connected-react-router'
import { Formik, FormikActions, FormikProps } from 'formik'
import React, { ComponentType } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import * as yup from 'yup'

import { publicOnly } from '../../../helpers/auth'
import ActionToaster from '../../../middlewares/ErrorToaster/ActionToaster'
import { AuthError } from '../../../services/auth'
import { AppState, AppThunkDispatch } from '../../../stores'
import { ContestInfo } from '../../../stores/Contest'
import { resetAction } from '../actions'
import { setEmailAction } from './actions'
import EnterEmailFormView from './EnterEmailFormView'

export interface EnterEmailFormValue {
  email: string
}

export interface EnterEmailFormProps {
  contest?: ContestInfo
  dispatch: AppThunkDispatch
}

class EnterEmailForm extends React.Component<EnterEmailFormProps> {
  initialValue: EnterEmailFormValue = {
    email: '',
  }

  validationSchema = yup.object().shape({
    email: yup
      .string()
      .min(4)
      .max(255)
      .email()
      .label('Email')
      .required(),
  })

  handleSubmit = async (
    values: EnterEmailFormValue,
    { setSubmitting }: FormikActions<EnterEmailFormValue>
  ) => {
    try {
      await this.props.dispatch(setEmailAction(values.email))
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

    const renderView = (props: FormikProps<EnterEmailFormValue>) => (
      <EnterEmailFormView
        contest={contest}
        gotoAnotherContest={this.props.dispatch.bind(this, resetAction())}
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

const mapStateToProps = (state: AppState) => ({
  contest: state.contest.info,
})

export default compose<ComponentType>(
  publicOnly(),
  connect(mapStateToProps)
)(EnterEmailForm)
