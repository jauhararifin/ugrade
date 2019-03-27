import React, { FunctionComponent, useEffect } from 'react'
import { Route, Switch } from 'react-router'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { useContest, useRouting, useServer, useWindow } from '../../app'
import { useContestOnly } from '../../common'
import { DashboardView } from './DashboardView'
import { Members } from './Members'
import { Overview } from './Overview'
import { Problems } from './Problems'
import { Settings } from './Settings'
import { Submissions } from './Submissions'

export const Dashboard: FunctionComponent = () => {
  useContestOnly()
  const routingStore = useRouting()
  const contestStore = useContest()
  const windowStore = useWindow()

  useEffect(() => {
    if (contestStore.current && contestStore.current.name) windowStore.title = `UGrade | ${contestStore.current.name}`
  }, [contestStore.current && contestStore.current.name])

  const serverStore = useServer()
  useEffect(() => {
    serverStore.loadClock()
  }, [])

  return (
    <DashboardView>
      <TransitionGroup className='eat-them-all'>
        <CSSTransition timeout={300} classNames='fade' key={location.pathname}>
          <Switch location={routingStore.location}>
            <Route path='/contest/' exact={true} component={Overview} />
            <Route path='/contest/overview' exact={true} component={Overview} />
            {/* <Route path='/contest/announcements' exact={true} component={Announcements} /> */}
            <Route path='/contest/problems' component={Problems} />
            {/* <Route path='/contest/clarifications' exact={true} component={Clarifications} /> */}
            <Route path='/contest/submissions' exact={true} component={Submissions} />
            {/* <Route path='/contest/scoreboard' exact={true} component={Scoreboard} /> */}
            <Route path='/contest/settings' exact={true} component={Settings} />
            <Route path='/contest/members' component={Members} />
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </DashboardView>
  )
}
