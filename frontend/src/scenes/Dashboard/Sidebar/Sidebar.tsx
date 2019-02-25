import { push } from 'connected-react-router'
import React, { Component, ComponentType } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { compose } from 'redux'

import { withServer } from '../../../helpers/server'
import { AppState, AppThunkDispatch } from '../../../stores'
import { User } from '../../../stores/Auth'
import { ContestState } from '../../../stores/Contest'
import { Menu, SidebarView } from './SidebarView'

export interface SidebarReduxProps {
  contest: ContestState
  me?: User
  dispatch: AppThunkDispatch
}

export interface SidebarServerProps {
  serverClock?: Date
}

export type SidebarProps = RouteComponentProps &
  SidebarReduxProps &
  SidebarServerProps

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
    const match = this.props.location.pathname.match(/contests\/([a-z]+)/)
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
    this.setState({ menu })
    switch (menu) {
      case Menu.Overview:
        return this.props.dispatch(push(`/contest`))
      case Menu.Announcements:
        return this.props.dispatch(push(`/contest/announcements`))
      case Menu.Problems:
        return this.props.dispatch(push(`/contest/problems`))
      case Menu.Clarifications:
        return this.props.dispatch(push(`/contest/clarifications`))
      case Menu.Submissions:
        return this.props.dispatch(push(`/contest/submissions`))
      case Menu.Scoreboard:
        return this.props.dispatch(push(`/contest/scoreboard`))
    }
  }

  newAnnouncementCount = () => {
    const contest = this.props.contest
    if (contest && contest.announcements) {
      return Object.values(contest.announcements).filter(x => !x.read).length
    }
    return 0
  }

  newClarificationCount = () => {
    const contest = this.props.contest
    const me = this.props.me
    if (me && contest && contest.clarifications) {
      const clarifs = Object.values(contest.clarifications)
      const clarifsCount = clarifs.map(
        clarif =>
          Object.values(clarif.entries).filter(
            entry => entry.sender !== me.id && !entry.read
          ).length
      )
      return clarifsCount.reduce((a, b) => a + b)
    }
    return 0
  }

  render() {
    const menu = this.state.menu
    const rank = 21

    return (
      <SidebarView
        contest={this.props.contest}
        rank={rank}
        serverClock={this.props.serverClock}
        menu={menu}
        onChoose={this.onMenuChoosed}
        newAnnouncementCount={this.newAnnouncementCount()}
        newClarificationCount={this.newClarificationCount()}
      />
    )
  }
}

const mapStateToProps = (state: AppState) => ({
  contest: state.contest,
  me: state.auth.me,
})

export default compose<ComponentType>(
  connect(mapStateToProps),
  withRouter,
  withServer
)(Sidebar)
