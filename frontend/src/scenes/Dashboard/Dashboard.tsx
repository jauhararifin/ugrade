import React, { Component, ComponentType } from 'react'
import { connect } from 'react-redux'
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { compose, Dispatch } from 'redux'

import { contestOnly } from '../../helpers/auth'
import { AppAction, AppState, AppThunkDispatch } from '../../stores'
import { ContestInfo } from '../../stores/Contest'
import { setTitle } from '../../stores/Title'
import { getContestProblems, getMyContestAction } from './actions'
import { DashboardView } from './DashboardView'

export interface DashboardSceneRoute {
  contestId: string
}

export interface DashboardSceneProps
  extends RouteComponentProps<DashboardSceneRoute> {
  contest?: ContestInfo
  dispatch: AppThunkDispatch & Dispatch<AppAction>
  serverClock?: Date
}

export class DashboardScene extends Component<DashboardSceneProps> {
  // private unsubscribeContestAnnouncement: () => any
  // private unsubscribeContestProblemIds: () => any
  // private unsubscribeContestClarifications: () => any

  constructor(props: DashboardSceneProps) {
    super(props)
    // this.unsubscribeContestAnnouncement = () => null
    // this.unsubscribeContestProblemIds = () => null
    // this.unsubscribeContestClarifications = () => null
  }

  async componentDidMount() {
    if (this.props.contest) {
      this.props.dispatch(setTitle(`UGrade | ${this.props.contest.name}`))
    } else {
      this.props.dispatch(getMyContestAction())
    }
    this.initializeProblems()
    // this.initializeAnnouncements(contest).catch(_ => null)
    // this.initializeProblems().catch(_ => null)
    // this.initializeClarifications(contest).catch(_ => null)
  }

  // initializeAnnouncements = async (contest: Contest) => {
  //   await this.props.dispatch(getContestAnnouncements(contest.id))
  //   this.unsubscribeContestAnnouncement = await this.props.dispatch(
  //     subscribeContestAnnouncements(contest, this.announcemnetIssued)
  //   )
  // }

  // announcemnetIssued = (announcements: Announcement[]) => {
  //   this.props.dispatch(
  //     setCurrentContestAnnouncements(
  //       this.props.contest as Contest,
  //       announcements
  //     )
  //   )
  // }

  initializeProblems = async () => {
    await this.props.dispatch(getContestProblems())
    // this.loadCurrentProblem()
    // this.unsubscribeContestProblemIds = await this.props.dispatch(
    //   subscribeContestProblemIds(contest, this.problemIdsUpdated)
    // )
  }

  // loadCurrentProblem = () => {
  //   const match = this.props.location.pathname.match(
  //     /\/contests\/[0-9]+\/problems\/([0-9]+)\/?/
  //   )
  //   if (match && match[1]) {
  //     this.props.dispatch(
  //       setCurrentContestCurrentProblem(
  //         parseInt(this.props.match.params.contestId, 10),
  //         parseInt(match[1], 10)
  //       )
  //     )
  //   }
  // }

  // problemIdsUpdated = (problemIds: number[]) => {
  //   if (this.props.contest) {
  //     this.props
  //       .dispatch(getContestProblemsByIds(this.props.contest.id, problemIds))
  //       .catch(_ => null)
  //   }
  // }

  // initializeClarifications = async (contest: Contest) => {
  //   if (contest.registered) {
  //     await this.props.dispatch(getContestClarifications(contest.id))
  //     this.unsubscribeContestClarifications = await this.props.dispatch(
  //       subscribeContestClarifications(contest, this.clarificationsUpdated)
  //     )
  //   }
  // }

  // clarificationsUpdated = (clarifications: Clarification[]) => {
  //   if (this.props.contest) {
  //     this.props.dispatch(
  //       setCurrentContestClarrifications(this.props.contest.id, clarifications)
  //     )
  //   }
  // }

  componentWillUnmount() {
    // this.unsubscribeContestAnnouncement()
    // this.unsubscribeContestProblemIds()
    // this.unsubscribeContestClarifications()
  }

  render() {
    return (
      <DashboardView>
        <TransitionGroup className='eat-them-all'>
          <CSSTransition
            timeout={300}
            classNames='fade'
            key={this.props.location.pathname}
          >
            <Switch location={this.props.location}>
              {/* <Route path='/contest/' exact={true} component={Overview} /> */}
              {/* <Route
                path='/contest/overview'
                exact={true}
                component={Overview}
              /> */}
              {/* <Route
                path='/contest/announcements'
                exact={true}
                component={Announcements}
              /> */}
              {/* <Route
                path='/contest/problems'
                exact={true}
                component={Problems}
              /> */}
              {/* <Route
                path='/contest/problems/:problemId'
                exact={true}
                component={ProblemDetailScene}
              /> */}
              {/* <Route
                path='/contest/clarifications'
                exact={true}
                component={Clarifications}
              /> */}
              {/* <Route
                path='/contest/submissions'
                exact={true}
                component={Submissions}
              /> */}
              {/* <Route
                path='/contest/scoreboard'
                exact={true}
                component={Scoreboard}
              /> */}
            </Switch>
          </CSSTransition>
        </TransitionGroup>
      </DashboardView>
    )
  }
}

const mapStateToProps = (state: AppState) => ({
  contest: state.contest.info,
})

export default compose<ComponentType>(
  contestOnly(),
  withRouter,
  connect(mapStateToProps)
)(DashboardScene)
