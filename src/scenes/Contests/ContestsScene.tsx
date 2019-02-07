import React, { ComponentType, Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { push, } from 'connected-react-router'

import './styles.css'
import { AppState, AppThunkDispatch } from '../../stores'
import { Contest } from '../../stores/Contest'
import { getContestsAction } from './actions'
import ContestsPage from './ContestsPage'
import { userOnly } from '../../helpers/auth'
import { withServer } from '../../helpers/server'

export interface ContestsSceneProps {
  dispatch: AppThunkDispatch
  contests: Contest[]
  serverClock?: Date
}

export class ContestsScene extends Component<ContestsSceneProps> {
  
  static defaultProps = {
    contests: []
  }

  componentDidMount = () => {
    this.props.dispatch(getContestsAction())
  }

  handleContestChoose = (contest: Contest) => {
    this.props.dispatch(push(`/contests/${contest.id}`))
  }

  render() {
    return <ContestsPage
      contests={this.props.contests}
      onContestChoose={this.handleContestChoose}
      serverClock={this.props.serverClock}
    />
  }
}

const mapStateToProps = (state: AppState) => ({
  contests: state.contest.contests
})

export default compose<ComponentType>(
  userOnly("/signin"),
  connect(mapStateToProps),
  withServer,
)(ContestsScene)
