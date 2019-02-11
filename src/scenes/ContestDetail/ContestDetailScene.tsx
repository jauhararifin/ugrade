import React, { Component, ComponentType } from 'react'
import { connect } from 'react-redux'
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { compose, Dispatch } from 'redux'

import { userOnly } from '../../helpers/auth'
import { AppAction, AppState, AppThunkDispatch } from '../../stores'
import { Contest, readAnnouncements } from '../../stores/Contest'
import { getContestAnnouncement } from './actions'
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
}

export class ContestDetailScene extends Component<ContestDetailSceneProps> {
  private loadingAnnouncement = false
  componentDidMount() {
    this.reloadAnnoucements()
  }
  componentDidUpdate() {
    this.reloadAnnoucements()
  }
  reloadAnnoucements = () => {
    if (this.props.contest && !this.loadingAnnouncement) {
      this.loadingAnnouncement = true
      this.props
        .dispatch(getContestAnnouncement(this.props.contest.id))
        .finally(() => {
          this.loadingAnnouncement = false
          setTimeout(this.reloadAnnoucements, 1000 * (15 + Math.random() * 15))
        })
    }
  }
  render() {
    return (
      <ContestDetailPage>
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
  connect(mapStateToProps)
)(ContestDetailScene)
