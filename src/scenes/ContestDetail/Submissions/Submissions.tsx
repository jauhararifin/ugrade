import React, { Component, ComponentType } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { userOnly } from '../../../helpers/auth'
import { withServer } from '../../../helpers/server'
import { AppState, AppThunkDispatch } from '../../../stores'
import { Contest, Submission } from '../../../stores/Contest'
import { setCurrentContestSubmissions } from '../../../stores/Contest/ContestSetCurrentContestSubmissions'
import { getContestSubmissions, subscribeContestSubmissions } from './actions'
import SubmissionsView from './SubmissionsView'

export interface SubmissionServerProps {
  serverClock: Date
}

export interface SubmissionsReduxProps {
  contest?: Contest
  dispatch: AppThunkDispatch
}

export type SubmissionProps = SubmissionServerProps & SubmissionsReduxProps

export class Submissions extends Component<SubmissionProps> {
  private unsubscribeContestSubmissions: () => any
  private initialized: boolean

  constructor(props: SubmissionProps) {
    super(props)

    this.initialized = false
    this.unsubscribeContestSubmissions = () => null
  }

  componentDidMount() {
    this.initializeSubmissions().catch(_ => null)
  }
  componentWillUpdate() {
    this.initializeSubmissions().catch(_ => null)
  }
  componentWillUnmount() {
    this.unsubscribeContestSubmissions()
  }

  initializeSubmissions = async () => {
    const contest = this.props.contest
    if (!this.initialized && contest) {
      this.initialized = true
      await this.props.dispatch(getContestSubmissions(contest.id))
      this.unsubscribeContestSubmissions = await this.props.dispatch(
        subscribeContestSubmissions(contest, this.submissionsIssued)
      )
    }
  }

  submissionsIssued = (submissions: Submission[]) => {
    this.props.dispatch(
      setCurrentContestSubmissions(this.props.contest as Contest, submissions)
    )
  }

  render() {
    const { contest, serverClock } = this.props
    return (
      <SubmissionsView
        submissions={contest ? contest.submissions : undefined}
        serverClock={serverClock}
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
)(Submissions)
