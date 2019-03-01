import { push } from 'connected-react-router'
import React, { ComponentType, FunctionComponent, useState } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { compose } from 'redux'
import { getMe, User } from 'ugrade/auth/store'
import { ContestState } from 'ugrade/contest/store'
import { useServerClock } from 'ugrade/server'
import { AppState, AppThunkDispatch } from 'ugrade/store'
import { useAnnouncements } from '../helpers/useAnnouncements'
import { Menu, SidebarView } from './SidebarView'

export interface SidebarReduxProps {
  contest: ContestState
  me?: User
  dispatch: AppThunkDispatch
}

export type SidebarProps = RouteComponentProps & SidebarReduxProps

export interface SidebarState {
  menu: Menu
}

export const Sidebar: FunctionComponent<SidebarProps> = ({
  contest,
  me,
  dispatch,
  location,
}) => {
  useAnnouncements(dispatch)
  const serverClock = useServerClock()

  const getCurrentMenu = (): Menu => {
    const match = location.pathname.match(/contest\/([a-z]+)/)
    if (match && match[1]) {
      switch (match[1]) {
        case 'announcements':
          return Menu.Announcements
        case 'problems':
          return Menu.Problems
        case 'clarifications':
          return Menu.Clarifications
        case 'submissions':
          return Menu.Submissions
        case 'scoreboard':
          return Menu.Scoreboard
      }
    }
    return Menu.Overview
  }

  const onMenuChoosed = (menu: Menu) => {
    setCurrentMenu(menu)
    switch (menu) {
      case Menu.Overview:
        return dispatch(push(`/contest`))
      case Menu.Announcements:
        return dispatch(push(`/contest/announcements`))
      case Menu.Problems:
        return dispatch(push(`/contest/problems`))
      case Menu.Clarifications:
        return dispatch(push(`/contest/clarifications`))
      case Menu.Submissions:
        return dispatch(push(`/contest/submissions`))
      case Menu.Scoreboard:
        return dispatch(push(`/contest/scoreboard`))
    }
  }

  const newAnnouncementCount = () => {
    if (contest && contest.announcements) {
      return Object.values(contest.announcements).filter(x => !x.read).length
    }
    return 0
  }

  const newClarificationCount = () => {
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

  const [currentMenu, setCurrentMenu] = useState(getCurrentMenu())
  const rank = 21

  return (
    <SidebarView
      contest={contest}
      rank={rank}
      serverClock={serverClock}
      menu={currentMenu}
      onChoose={onMenuChoosed}
      newAnnouncementCount={newAnnouncementCount()}
      newClarificationCount={newClarificationCount()}
    />
  )
}

const mapStateToProps = (state: AppState) => ({
  contest: state.contest,
  me: getMe(state),
})

export default compose<ComponentType>(
  connect(mapStateToProps),
  withRouter
)(Sidebar)
