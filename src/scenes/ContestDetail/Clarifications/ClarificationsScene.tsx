import React, { Component, ComponentType } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { compose, Dispatch } from 'redux'
import * as yup from 'yup'

import { Formik, FormikActions, FormikProps } from 'formik'
import { userOnly } from '../../../helpers/auth'
import { withServer } from '../../../helpers/server'
import ActionToaster from '../../../middlewares/ErrorToaster/ActionToaster'
import { AppAction, AppState, AppThunkDispatch } from '../../../stores'
import { Contest } from '../../../stores/Contest'
import { createContestClarification } from './actions'
import { ClarificationsView } from './ClarificationsView'
import { NewClarificationFormValue } from './NewClarificationForm'

export interface ClarificationsSceneRoute {
  contestId: string
}

export interface ClarificationsSceneProps
  extends RouteComponentProps<ClarificationsSceneRoute> {
  contest?: Contest
  dispatch: AppThunkDispatch & Dispatch<AppAction>
  serverClock?: Date
}

export class ClarificationsScene extends Component<ClarificationsSceneProps> {
  createClairificationFormInitialValue = {
    title: '',
    subject: 'General Issue',
    content: '',
  }

  createClarificationValidationSchema = yup.object().shape({
    title: yup.string().required(),
    subject: yup.string().required(),
    content: yup.string().required(),
  })

  handleCreateClarification = (
    values: NewClarificationFormValue,
    { setSubmitting, resetForm }: FormikActions<NewClarificationFormValue>
  ) => {
    if (this.props.contest) {
      this.props
        .dispatch(
          createContestClarification(
            this.props.contest,
            values.title,
            values.subject,
            values.content
          )
        )
        .then(() => ActionToaster.showSuccessToast('Clarification Sent'))
        .finally(() => {
          setSubmitting(false)
          resetForm()
        })
    }
  }

  render() {
    const renderClarificationsView = (
      props: FormikProps<NewClarificationFormValue>
    ) => (
      <ClarificationsView
        contest={this.props.contest}
        serverClock={this.props.serverClock}
        clarificationForm={props}
      />
    )
    return (
      <Formik
        initialValues={this.createClairificationFormInitialValue}
        onSubmit={this.handleCreateClarification}
        validationSchema={this.createClarificationValidationSchema}
        render={renderClarificationsView}
      />
    )
  }
}

const mapStateToProps = (state: AppState) => ({
  contest: state.contest.currentContest,
})

export default compose<ComponentType>(
  userOnly(),
  connect(mapStateToProps),
  withServer
)(ClarificationsScene)
