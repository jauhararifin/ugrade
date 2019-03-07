import React, { FunctionComponent, useEffect } from 'react'
import { Route, Switch } from 'react-router'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { useContestOnly } from 'ugrade/auth'
import { useAppDispatch } from 'ugrade/common'
import { setTitle } from 'ugrade/common/title/store'
import { useContestInfo } from 'ugrade/contest'
import { useLocation } from 'ugrade/router'
import { Announcements } from './Announcements'
import { Clarifications } from './Clarifications'
import { DashboardView } from './DashboardView'
import { Overview } from './Overview/Overview'
import { Problems } from './Problems'
import { CreateProblem } from './Problems/CreateProblem'
import { ProblemDetail } from './Problems/ProblemDetail'
import { Scoreboard } from './Scoreboard'
import { Settings } from './Settings'
import { Submissions } from './Submissions'

export const Dashboard: FunctionComponent = () => {
  useContestOnly()
  const location = useLocation()
  const contest = useContestInfo()
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (contest && contest.name) dispatch(setTitle(`UGrade | ${contest.name}`))
  }, [contest && contest.name])
  return (
    <DashboardView>
      <TransitionGroup className='eat-them-all'>
        <CSSTransition timeout={300} classNames='fade' key={location.pathname}>
          <Switch location={location}>
            <Route path='/contest/' exact={true} component={Overview} />
            <Route path='/contest/overview' exact={true} component={Overview} />
            <Route
              path='/contest/announcements'
              exact={true}
              component={Announcements}
            />
            <Route path='/contest/problems' exact={true} component={Problems} />
            <Route
              path='/contest/problems/create'
              exact={true}
              component={CreateProblem}
            />
            <Route
              path='/contest/problems/:problemId'
              component={ProblemDetail}
            />
            <Route
              path='/contest/clarifications'
              exact={true}
              component={Clarifications}
            />
            <Route
              path='/contest/submissions'
              exact={true}
              component={Submissions}
            />
            <Route
              path='/contest/scoreboard'
              exact={true}
              component={Scoreboard}
            />
            <Route path='/contest/settings' exact={true} component={Settings} />
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </DashboardView>
  )
}
