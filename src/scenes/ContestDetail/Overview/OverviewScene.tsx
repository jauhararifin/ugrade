import React, { Component, ComponentType } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { compose } from 'redux'

import { userOnly } from '../../../helpers/auth'
import { AppState } from '../../../stores'
import { Contest } from '../../../stores/Contest'
import ContestOverviewPage from './OverviewPage'

export interface OverviewSceneRoute {
  contestId: string
}

export interface OverviewSceneProps
  extends RouteComponentProps<OverviewSceneRoute> {
  contest?: Contest
}

export class OverviewScene extends Component<OverviewSceneProps> {
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
)(OverviewScene)
