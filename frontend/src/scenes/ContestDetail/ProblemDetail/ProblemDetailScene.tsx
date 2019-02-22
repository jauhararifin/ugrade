import React, { Component, ComponentType } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { compose } from 'redux'

import { userOnly } from '../../../helpers/auth'
import { AppState } from '../../../stores'
import { Problem } from '../../../stores/Contest'
import { ProblemDetailView } from './ProblemDetailView'

export interface ProblemDetailSceneRoute {
  contestId: string
  problemId: string
}

export interface ProblemDetailSceneProps
  extends RouteComponentProps<ProblemDetailSceneRoute> {
  problem?: Problem
}

export class ProblemDetailScene extends Component<ProblemDetailSceneProps> {
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
)(ProblemDetailScene)
