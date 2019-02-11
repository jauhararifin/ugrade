import React, { Component, ComponentType } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { compose } from 'redux'

import { userOnly } from '../../../helpers/auth'
import { AppState } from '../../../stores'
import { Problem } from '../../../stores/Contest'
import { ProblemDetailView } from './ProblemDetailView'

export interface AnnouncementsSceneRoute {
  contestId: string
  problemId: string
}

export interface AnnouncementsSceneProps
  extends RouteComponentProps<AnnouncementsSceneRoute> {
  problem?: Problem
}

export class AnnouncementsScene extends Component<AnnouncementsSceneProps> {
  render() {
    const { problem } = this.props
    return <ProblemDetailView problem={problem} />
  }
}

const mapStateToProps = (state: AppState) => ({
  problem:
    state.contest.currentContest && state.contest.currentContest.currentProblem,
})

export default compose<ComponentType>(
  userOnly(),
  connect(mapStateToProps)
)(AnnouncementsScene)
