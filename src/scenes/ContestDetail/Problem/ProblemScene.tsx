import React, { Component, ComponentType } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { compose, Dispatch } from 'redux'

import { userOnly } from '../../../helpers/auth'
import { AppAction, AppState, AppThunkDispatch } from '../../../stores'
import { Contest } from '../../../stores/Contest'
import { ProblemListView } from './ProblemListView'

export interface AnnouncementsSceneRoute {
  contestId: string
}

export interface AnnouncementsSceneProps
  extends RouteComponentProps<AnnouncementsSceneRoute> {
  contest?: Contest
  dispatch: AppThunkDispatch & Dispatch<AppAction>
}

export class AnnouncementsScene extends Component<AnnouncementsSceneProps> {
  render() {
    const { contest } = this.props
    return <ProblemListView problems={contest && contest.problems} />
  }
}

const mapStateToProps = (state: AppState) => ({
  contest: state.contest.currentContest,
})

export default compose<ComponentType>(
  userOnly(),
  connect(mapStateToProps)
)(AnnouncementsScene)
