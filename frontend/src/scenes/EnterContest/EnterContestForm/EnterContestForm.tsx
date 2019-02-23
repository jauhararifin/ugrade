import { Formik, FormikActions } from 'formik'
import React, { ComponentType } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import * as yup from 'yup'

import { push } from 'connected-react-router'

import { publicOnly } from '../../../helpers/auth'
import { AppThunkDispatch } from '../../../stores'
import { enterContest } from './actions'
import EnterContestFormView from './EnterContestFormView'

export interface EnterContestFormValue {
  contestId: string
}

export interface EnterContestFormProps {
  dispatch: AppThunkDispatch
}

class EnterContestForm extends React.Component<EnterContestFormProps, {}> {
  initialValue: EnterContestFormValue = {
    contestId: '',
  }

  validationSchema = yup.object().shape({
    contestId: yup
      .string()
      .min(4)
      .max(255)
      .label('contest id')
      .matches(/[a-zA-Z0-9\-]+/)
      .required(),
  })

  handleSubmit = (
    values: EnterContestFormValue,
    { setSubmitting }: FormikActions<EnterContestFormValue>
  ) => {
    this.props
      .dispatch(enterContest(values.contestId))
      .then(() => this.props.dispatch(push('/signin')))
      .catch(_ => null)
      .then(() => setSubmitting(false))
  }

  render() {
    return (
      <Formik
        initialValues={this.initialValue}
        validationSchema={this.validationSchema}
        onSubmit={this.handleSubmit}
        component={EnterContestFormView}
      />
    )
  }
}

export default compose<ComponentType>(
  publicOnly(),
  connect()
)(EnterContestForm)
