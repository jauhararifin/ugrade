import React, { Component, ComponentType } from 'react'
import { connect } from 'react-redux'
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { compose, Dispatch } from 'redux'

import { userOnly } from '../../helpers/auth'
import { withServer } from '../../helpers/server'
import { Announcement } from '../../services/contest/Announcement'
import { AppAction, AppState, AppThunkDispatch } from '../../stores'
import { Contest, setCurrentContestAnnouncements } from '../../stores/Contest'
import {
  getContestAnnouncement,
  getContestById,
  subscribeContestAnnouncements,
} from './actions'
import Announcements from './Announcements'
import { ContestDetailPage } from './ContestDetailPage'
import ContestOverview from './ContestOverview'

export interface ContestDetailSceneRoute {
  contestId: string
}

export interface ContestDetailSceneProps
  extends RouteComponentProps<ContestDetailSceneRoute> {
  contest?: Contest
  dispatch: AppThunkDispatch & Dispatch<AppAction>
  serverClock?: Date
}

export class ContestDetailScene extends Component<ContestDetailSceneProps> {
  private unsubscribeContestAnnouncement: () => any

  constructor(props: ContestDetailSceneProps) {
    super(props)
    this.unsubscribeContestAnnouncement = () => null
  }

  async componentDidMount() {
    const contestId = Number(this.props.match.params.contestId)
    if (!this.props.contest) {
      const contest = await this.props.dispatch(getContestById(contestId))
      await this.props.dispatch(getContestAnnouncement(contest.id))
      this.unsubscribeContestAnnouncement = await this.props.dispatch(
        subscribeContestAnnouncements(contest, this.announcemnetIssued)
      )
    }
  }

  announcemnetIssued = (announcements: Announcement[]) => {
    this.props.dispatch(
      setCurrentContestAnnouncements(
        this.props.contest as Contest,
        announcements
      )
    )
  }

  componentWillUnmount() {
    this.unsubscribeContestAnnouncement()
  }

  render() {
    return (
      <ContestDetailPage serverClock={this.props.serverClock}>
        <TransitionGroup className='eat-them-all'>
          <CSSTransition
            timeout={300}
            classNames='fade'
            key={this.props.location.pathname}
          >
            <Switch location={this.props.location}>
              <Route
                path='/contests/:contestId/'
                exact={true}
                component={ContestOverview}
              />
              <Route
                path='/contests/:contestId/overview'
                exact={true}
                component={ContestOverview}
              />
              <Route
                path='/contests/:contestId/announcements'
                exact={true}
                component={Announcements}
              />
            </Switch>
          </CSSTransition>
        </TransitionGroup>
      </ContestDetailPage>
    )
  }
}

const mapStateToProps = (state: AppState) => ({
  contest: state.contest.currentContest,
})

export default compose<ComponentType>(
  userOnly(),
  withRouter,
  withServer,
  connect(mapStateToProps)
)(ContestDetailScene)
