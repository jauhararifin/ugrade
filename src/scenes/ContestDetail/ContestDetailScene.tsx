import React, { Component, ComponentType } from 'react'
import { connect } from 'react-redux'
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { compose, Dispatch } from 'redux'

import { userOnly } from '../../helpers/auth'
import { withServer } from '../../helpers/server'
import { Announcement } from '../../services/contest/Announcement'
import { Clarification } from '../../services/contest/Clarification'
import { AppAction, AppState, AppThunkDispatch } from '../../stores'
import {
  Contest,
  setCurrentContestAnnouncements,
  setCurrentContestCurrentProblem,
  unsetCurrentContest,
} from '../../stores/Contest'
import { setCurrentContestClarrifications } from '../../stores/Contest/ContestSetCurrentContestClarrifications'
import { setTitle } from '../../stores/Title'
import {
  getContestAnnouncements,
  getContestById,
  getContestClarifications,
  getContestProblems,
  getContestProblemsByIds,
  subscribeContestAnnouncements,
  subscribeContestClarifications,
  subscribeContestProblemIds,
} from './actions'
import Announcements from './Announcements'
import Clarifications from './Clarifications'
import { ContestDetailPage } from './ContestDetailPage'
import Overview from './Overview'
import ProblemDetailScene from './ProblemDetail'
import Problems from './Problems'

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
  private unsubscribeContestClarifications: () => any

  constructor(props: ContestDetailSceneProps) {
    super(props)
    this.unsubscribeContestAnnouncement = () => null
    this.unsubscribeContestProblemIds = () => null
    this.unsubscribeContestClarifications = () => null
  }

  async componentDidMount() {
    const contestId = Number(this.props.match.params.contestId)
    const contest = await this.props.dispatch(getContestById(contestId))
    this.props.dispatch(setTitle(`UGrade | ${contest.name}`))
    this.initializeAnnouncements(contest).catch(_ => null)
    this.initializeProblems(contest).catch(_ => null)
    this.initializeClarifications(contest).catch(_ => null)
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
    if (contest.registered) {
      await this.props.dispatch(getContestProblems(contest.id))
      this.loadCurrentProblem()
      this.unsubscribeContestProblemIds = await this.props.dispatch(
        subscribeContestProblemIds(contest, this.problemIdsUpdated)
      )
    }
  }

  loadCurrentProblem = () => {
    const match = this.props.location.pathname.match(
      /\/contests\/[0-9]+\/problems\/([0-9]+)\/?/
    )
    if (match && match[1]) {
      this.props.dispatch(
        setCurrentContestCurrentProblem(
          parseInt(this.props.match.params.contestId, 10),
          parseInt(match[1], 10)
        )
      )
    }
  }

  problemIdsUpdated = (problemIds: number[]) => {
    if (this.props.contest) {
      this.props
        .dispatch(getContestProblemsByIds(this.props.contest.id, problemIds))
        .catch(_ => null)
    }
  }

  initializeClarifications = async (contest: Contest) => {
    if (contest.registered) {
      await this.props.dispatch(getContestClarifications(contest.id))
      this.unsubscribeContestClarifications = await this.props.dispatch(
        subscribeContestClarifications(contest, this.clarificationsUpdated)
      )
    }
  }

  clarificationsUpdated = (clarifications: Clarification[]) => {
    if (this.props.contest) {
      this.props.dispatch(
        setCurrentContestClarrifications(this.props.contest.id, clarifications)
      )
    }
  }

  componentWillUnmount() {
    this.unsubscribeContestAnnouncement()
    this.unsubscribeContestProblemIds()
    this.unsubscribeContestClarifications()

    this.props.dispatch(unsetCurrentContest())
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
                component={Overview}
              />
              <Route
                path='/contests/:contestId/overview'
                exact={true}
                component={Overview}
              />
              <Route
                path='/contests/:contestId/announcements'
                exact={true}
                component={Announcements}
              />
              <Route
                path='/contests/:contestId/problems'
                exact={true}
                component={Problems}
              />
              <Route
                path='/contests/:contestId/problems/:problemId'
                exact={true}
                component={ProblemDetailScene}
              />
              <Route
                path='/contests/:contestId/clarifications'
                exact={true}
                component={Clarifications}
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
