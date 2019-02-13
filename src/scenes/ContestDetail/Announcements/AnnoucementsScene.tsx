import React, { Component, ComponentType } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { compose, Dispatch } from 'redux'

import { userOnly } from '../../../helpers/auth'
import { withServer } from '../../../helpers/server'
import { AppAction, AppState, AppThunkDispatch } from '../../../stores'
import { Contest } from '../../../stores/Contest'
import { readAnnouncementsAction } from '../actions'
import { AnnouncementsView } from './AnnouncementsView'

export interface AnnouncementsSceneRoute {
  contestId: string
}

export interface AnnouncementsSceneProps
  extends RouteComponentProps<AnnouncementsSceneRoute> {
  contest?: Contest
  dispatch: AppThunkDispatch & Dispatch<AppAction>
  serverClock?: Date
}

export class AnnouncementsScene extends Component<AnnouncementsSceneProps> {
  componentDidMount() {
    this.readAllAnnouncements().catch(_ => null)
  }
  componentDidUpdate() {
    this.readAllAnnouncements().catch(_ => null)
  }
  readAllAnnouncements = async () => {
    if (this.props.contest && this.props.contest.announcements) {
      await new Promise(resolve => setTimeout(resolve, 2000)) // read after 2 seconds
      const announcements = this.props.contest.announcements.filter(
        annoucement => !annoucement.read
      )
      if (announcements.length > 0) {
        this.props
          .dispatch(
            readAnnouncementsAction(
              this.props.contest.id,
              announcements.map(it => it.id)
            )
          )
          .catch(_ => null)
      }
    }
  }
  render() {
    return (
      <AnnouncementsView
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
)(AnnouncementsScene)
