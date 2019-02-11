import { push } from 'connected-react-router'
import React, { Component, ComponentType } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { compose } from 'redux'

import { userOnly } from '../../../helpers/auth'
import { withServer } from '../../../helpers/server'
import { AppState, AppThunkDispatch } from '../../../stores'
import { Contest } from '../../../stores/Contest'
import { getContestById } from './actions'
import { Menu, SidebarView } from './SidebarView'

export interface SidebarSceneRoute {
  contestId: string
}

export interface ContestDetailSceneProps
  extends RouteComponentProps<SidebarSceneRoute> {
  contest?: Contest
  serverClock: Date
  dispatch: AppThunkDispatch
}

export interface ContestDetailSceneState {
  menu: Menu
}

export class ContestDetailScene extends Component<
  ContestDetailSceneProps,
  ContestDetailSceneState
> {
  constructor(props: ContestDetailSceneProps) {
    super(props)

    let menu = Menu.Overview
    const match = props.location.pathname.match(/contests\/[0-9]+\/([a-z]+)/)
    if (match && match[1]) {
      switch (match[1]) {
        case 'announcements':
          menu = Menu.Announcements
          break
        case 'problems':
          menu = Menu.Problems
          break
        case 'clarifications':
          menu = Menu.Clarifications
          break
        case 'submissions':
          menu = Menu.Submissions
          break
        case 'scoreboard':
          menu = Menu.Scoreboard
          break
      }
    }

    this.state = { menu }
  }
  componentDidMount() {
    const contestId = Number(this.props.match.params.contestId)
    if (!this.props.contest) this.props.dispatch(getContestById(contestId))
  }
  onMenuChoosed = (menu: Menu) => {
    const contestId = Number(this.props.match.params.contestId)

    this.setState({ menu })
    switch (menu) {
      case Menu.Overview:
        return this.props.dispatch(push(`/contests/${contestId}`))
      case Menu.Announcements:
        return this.props.dispatch(push(`/contests/${contestId}/announcements`))
      case Menu.Problems:
        return this.props.dispatch(push(`/contests/${contestId}/problems`))
      case Menu.Clarifications:
        return this.props.dispatch(
          push(`/contests/${contestId}/clarifications`)
        )
      case Menu.Submissions:
        return this.props.dispatch(push(`/contests/${contestId}/submissions`))
      case Menu.Scoreboard:
        return this.props.dispatch(push(`/contests/${contestId}/scoreboard`))
    }
  }
  render() {
    const { contest, serverClock } = this.props
    const menu = this.state.menu
    const rank = 21
    return (
      <SidebarView
        contest={contest}
        rank={rank}
        serverClock={serverClock}
        menu={menu}
        onChoose={this.onMenuChoosed}
      />
    )
  }
}

const mapStateToProps = (state: AppState) => ({
  contest: state.contest.currentContest,
})

export default compose<ComponentType>(
  userOnly(),
  withServer,
  connect(mapStateToProps),
  withRouter
)(ContestDetailScene)
