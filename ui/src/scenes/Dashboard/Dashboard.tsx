import React, { FunctionComponent, useEffect } from 'react'
import { Switch } from 'react-router'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { useContest, useRouting } from '../../app'
import { title, useContestOnly } from '../../common'
import { DashboardView } from './DashboardView'

export const Dashboard: FunctionComponent = () => {
  useContestOnly()
  const routingStore = useRouting()
  const contestStore = useContest()
  useEffect(() => {
    if (contestStore.current && contestStore.current.name) title(`UGrade | ${contestStore.current.name}`)
  }, [contestStore.current && contestStore.current.name])

  return (
    <DashboardView>
      <TransitionGroup className='eat-them-all'>
        <CSSTransition timeout={300} classNames='fade' key={location.pathname}>
          <Switch location={routingStore.location}>
            {/* <Route path='/contest/' exact={true} component={Overview} /> */}
            {/* <Route path='/contest/overview' exact={true} component={Overview} /> */}
            {/* <Route path='/contest/announcements' exact={true} component={Announcements} /> */}
            {/* <Route path='/contest/problems' component={Problems} /> */}
            {/* <Route path='/contest/clarifications' exact={true} component={Clarifications} /> */}
            {/* <Route path='/contest/submissions' exact={true} component={Submissions} /> */}
            {/* <Route path='/contest/scoreboard' exact={true} component={Scoreboard} /> */}
            {/* <Route path='/contest/settings' exact={true} component={Settings} /> */}
            {/* <Route path='/contest/members' component={Members} /> */}
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </DashboardView>
  )
}
