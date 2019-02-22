import { push } from 'connected-react-router'
import React, { Component, ComponentType } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { compose } from 'redux'

import { AppState, AppThunkDispatch } from '../../../stores'
import { Contest } from '../../../stores/Contest'
import { ContestDetailSceneRoute } from '../ContestDetailScene'
import { Menu, SidebarView } from './SidebarView'

export interface SidebarReduxProps {
  contest?: Contest
  username: string
  dispatch: AppThunkDispatch
}

export interface SidebarOwnProps {
  serverClock?: Date
}

export type SidebarProps = RouteComponentProps<ContestDetailSceneRoute> &
  SidebarReduxProps &
  SidebarOwnProps

export interface SidebarState {
  menu: Menu
}

export class Sidebar extends Component<SidebarProps, SidebarState> {
  constructor(props: SidebarProps) {
    super(props)
    this.state = { menu: this.getCurrentMenu() }
  }

  getCurrentMenu = () => {
    let menu = Menu.Overview
    const match = this.props.location.pathname.match(
      /contests\/[0-9]+\/([a-z]+)/
    )
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
    return menu
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
    const { contest, serverClock, username } = this.props
    const newAnnouncementCount =
      contest && contest.announcements
        ? contest.announcements.filter(x => !x.read).length
        : 0
    const newClarificationCount =
      contest && contest.clarifications
        ? contest.clarifications
            .map(
              clarif =>
                clarif.entries.filter(
                  entry => entry.sender !== username && !entry.read
                ).length
            )
            .reduce((a, b) => a + b)
        : 0
    const menu = this.state.menu
    const rank = 21

    return (
      <SidebarView
        contest={contest}
        rank={rank}
        serverClock={serverClock}
        menu={menu}
        onChoose={this.onMenuChoosed}
        newAnnouncementCount={newAnnouncementCount}
        newClarificationCount={newClarificationCount}
      />
    )
  }
}

const mapStateToProps = (state: AppState) => ({
  contest: state.contest.currentContest,
  username: state.auth.me ? state.auth.me.username : '',
})

export default compose<ComponentType<SidebarOwnProps>>(
  connect(mapStateToProps),
  withRouter
)(Sidebar)
