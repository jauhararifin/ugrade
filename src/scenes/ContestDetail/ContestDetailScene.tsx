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
  getContestAnnouncements,
  getContestById,
  getContestProblems,
  getContestProblemsByIds,
  subscribeContestAnnouncements,
  subscribeContestProblemIds,
} from './actions'
import Announcements from './Announcements'
import { ContestDetailPage } from './ContestDetailPage'
import ContestOverview from './ContestOverview'
import Problem from './Problem'

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
  private unsubscribeContestProblemIds: () => any

  constructor(props: ContestDetailSceneProps) {
    super(props)
    this.unsubscribeContestAnnouncement = () => null
    this.unsubscribeContestProblemIds = () => null
  }

  async componentDidMount() {
    const contestId = Number(this.props.match.params.contestId)
    if (!this.props.contest) {
      const contest = await this.props.dispatch(getContestById(contestId))
      this.initializeAnnouncements(contest)
      this.initializeProblems(contest)
    }
  }

  initializeAnnouncements = async (contest: Contest) => {
    await this.props.dispatch(getContestAnnouncements(contest.id))
    this.unsubscribeContestAnnouncement = await this.props.dispatch(
      subscribeContestAnnouncements(contest, this.announcemnetIssued)
    )
  }

  announcemnetIssued = (announcements: Announcement[]) => {
    this.props.dispatch(
      setCurrentContestAnnouncements(
        this.props.contest as Contest,
        announcements
      )
    )
  }

  initializeProblems = async (contest: Contest) => {
    await this.props.dispatch(getContestProblems(contest.id))
    this.unsubscribeContestProblemIds = await this.props.dispatch(
      subscribeContestProblemIds(contest, this.problemIdsUpdated)
    )
  }

  problemIdsUpdated = (problemIds: number[]) => {
    if (this.props.contest) {
      this.props.dispatch(
        getContestProblemsByIds(this.props.contest.id, problemIds)
      )
    }
  }

  componentWillUnmount() {
    this.unsubscribeContestAnnouncement()
    this.unsubscribeContestProblemIds()
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
              <Route
                path='/contests/:contestId/problems'
                exact={true}
                component={Problem}
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
