import { Formik, FormikActions } from 'formik'
import React, { Component, ComponentType } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import * as yup from 'yup'

import ActionToaster from '../../../../middlewares/ErrorToaster/ActionToaster'
import { AppThunkDispatch } from '../../../../stores'
import { Contest } from '../../../../stores/Contest'
import { registerContest, unregisterContest } from './actions'
import { ContestRegisterFormView } from './ContestRegisterFormView'

export interface ContestRegisterFormValue {
  register: boolean
}

export interface ContestRegisterFormReduxProps {
  dispatch: AppThunkDispatch
}

export interface ContestRegisterFormOwnProps {
  contest: Contest
  serverClock: Date
}

export type ContestRegisterFormProps = ContestRegisterFormOwnProps &
  ContestRegisterFormReduxProps

export class ContestRegisterForm extends Component<ContestRegisterFormProps> {
  validationSchema = yup.object().shape({
    register: yup.boolean().required(),
  })
  getInitialValue = () => {
    return { register: !this.props.contest.registered }
  }
  handleSubmit = (
    values: ContestRegisterFormValue,
    { setSubmitting, resetForm }: FormikActions<ContestRegisterFormValue>
  ) => {
    const contestId = Number(this.props.contest.id)
    const register = values.register
    const action = register
      ? registerContest(contestId)
      : unregisterContest(contestId)
    const text = register ? 'You Are Registered' : 'You Are Unregistered'

    this.props
      .dispatch(action)
      .then(() => {
        ActionToaster.showSuccessToast(text)
      })
      .finally(() => {
        setSubmitting(false)
        resetForm()
      })
      .catch(_ => null)
  }
  render() {
    const { serverClock, contest } = this.props
    const started = serverClock >= contest.startTime
    if (started) return <React.Fragment />

    return (
      <Formik
        initialValues={this.getInitialValue()}
        validationSchema={this.validationSchema}
        onSubmit={this.handleSubmit}
        component={ContestRegisterFormView}
      />
    )
  }
}

export default compose<ComponentType<ContestRegisterFormOwnProps>>(connect())(
  ContestRegisterForm
)
