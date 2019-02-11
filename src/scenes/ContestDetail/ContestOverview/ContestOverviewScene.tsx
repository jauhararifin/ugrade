import React, { Component, ComponentType } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { compose } from 'redux'

import { userOnly } from '../../../helpers/auth'
import { AppState } from '../../../stores'
import { Contest } from '../../../stores/Contest'
import ContestOverviewPage from './ContestOverviewPage'

export interface ContestDetailSceneRoute {
  contestId: string
}

export interface ContestDetailSceneProps
  extends RouteComponentProps<ContestDetailSceneRoute> {
  contest?: Contest
}

export class ContestDetailScene extends Component<ContestDetailSceneProps> {
  render() {
    const { contest } = this.props
    return <ContestOverviewPage contest={contest} />
  }
}

const mapStateToProps = (state: AppState) => ({
  contest: state.contest.currentContest,
})

export default compose<ComponentType>(
  userOnly(),
  connect(mapStateToProps)
)(ContestDetailScene)
