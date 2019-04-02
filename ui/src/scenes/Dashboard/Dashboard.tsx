import { useContestOnly } from '@/auth'
import { useRouting } from '@/routing'
import { title } from '@/window'
import gql from 'graphql-tag'
import React, { FunctionComponent, useEffect } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { Switch } from 'react-router'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { DashboardView } from './DashboardView'
import { putItem } from './TopNavigationBar/Breadcrumbs/Breadcrumbs'

export const Dashboard: FunctionComponent = () => {
  useContestOnly()
  const routingStore = useRouting()

  title('UGrade | Dashboard')

  const { data } = useQuery(gql`
    query GetMyContest {
      myContest {
        name
      }
    }
  `)
  useEffect(() => {
    return putItem(`/contest`, data && data.myContest && data.myContest.name)
  }, [data])

  return (
    <DashboardView>
      <TransitionGroup className='eat-them-all'>
        <CSSTransition timeout={300} classNames='fade' key={location.pathname}>
          <Switch location={routingStore.location}>
            {/* <Route path='/contest/' exact={true} component={Overview} />
            <Route path='/contest/overview' exact={true} component={Overview} />
            <Route path='/contest/problems' component={Problems} />
            <Route path='/contest/submissions' exact={true} component={Submissions} />
            <Route path='/contest/settings' exact={true} component={Settings} />
            <Route path='/contest/members' component={Members} /> */}
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </DashboardView>
  )
}
