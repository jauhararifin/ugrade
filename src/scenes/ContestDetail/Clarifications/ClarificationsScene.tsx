import React, { Component, ComponentType } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { compose, Dispatch } from 'redux'

import { userOnly } from '../../../helpers/auth'
import { withServer } from '../../../helpers/server'
import { AppAction, AppState, AppThunkDispatch } from '../../../stores'
import { Contest } from '../../../stores/Contest'
import { ClarificationsView } from './ClarificationsView'

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
  render() {
    return (
      <ClarificationsView
        contest={this.props.contest}
        serverClock={this.props.serverClock}
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
