import React, { Component, ComponentType } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { compose, Dispatch } from 'redux'

import { userOnly } from '../../../helpers/auth'
import { AppAction, AppState, AppThunkDispatch } from '../../../stores'
import { Contest, Problem } from '../../../stores/Contest'
import { loadContestProblem } from '../actions'
import { ProblemsView } from './ProblemsView'

export interface AnnouncementsSceneRoute {
  contestId: string
}

export interface AnnouncementsSceneProps
  extends RouteComponentProps<AnnouncementsSceneRoute> {
  contest?: Contest
  dispatch: AppThunkDispatch & Dispatch<AppAction>
}

export class AnnouncementsScene extends Component<AnnouncementsSceneProps> {
  handleProblemChoose = (problem: Problem) => {
    const { contest } = this.props
    if (contest) {
      this.props
        .dispatch(loadContestProblem(contest.id, problem.id))
        .catch(_ => null)
    }
  }
  render() {
    const { contest } = this.props
    return (
      <ProblemsView
        problems={contest && contest.problems}
        onChoose={this.handleProblemChoose}
      />
    )
  }
}

const mapStateToProps = (state: AppState) => ({
  contest: state.contest.currentContest,
})

export default compose<ComponentType>(
  userOnly(),
  connect(mapStateToProps)
)(AnnouncementsScene)
