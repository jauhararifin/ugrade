import React, { ComponentType, FunctionComponent, useEffect } from 'react'
import { connect } from 'react-redux'
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { compose, Dispatch } from 'redux'

import { contestOnly } from '../../helpers/auth'
import { AppAction, AppState, AppThunkDispatch } from '../../stores'
import { ContestInfo } from '../../stores/Contest'
import { setTitle } from '../../stores/Title'
import DashboardView from './DashboardView'
import { useInfo } from './helpers'
import Overview from './Overview/Overview'
import Problems from './Problems/Problems'

export interface DashboardProps extends RouteComponentProps {
  contest?: ContestInfo
  dispatch: AppThunkDispatch & Dispatch<AppAction>
}

export const Dashboard: FunctionComponent<DashboardProps> = ({
  dispatch,
  location,
  contest,
}) => {
  useInfo(dispatch)
  useEffect(() => {
    if (contest) dispatch(setTitle(`UGrade | ${contest.name}`))
  }, [contest])
  return (
    <DashboardView>
      <TransitionGroup className='eat-them-all'>
        <CSSTransition timeout={300} classNames='fade' key={location.pathname}>
          <Switch location={location}>
            <Route path='/contest/' exact={true} component={Overview} />
            <Route path='/contest/overview' exact={true} component={Overview} />
            <Route path='/contest/problems' exact={true} component={Problems} />
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </DashboardView>
  )
}

const mapStateToProps = (state: AppState) => ({
  contest: state.contest.info,
})

export default compose<ComponentType>(
  contestOnly(),
  withRouter,
  connect(mapStateToProps)
)(Dashboard)
