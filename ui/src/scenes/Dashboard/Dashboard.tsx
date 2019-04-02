import { useContestOnly } from '@/auth'
import { useRouting } from '@/routing'
import gql from 'graphql-tag'
import React, { FunctionComponent, useEffect } from 'react'
import { useQuery } from 'react-apollo-hooks'
import DocumentTitle from 'react-document-title'
import { Switch } from 'react-router'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { DashboardView } from './DashboardView'
import { putItem } from './TopNavigationBar/Breadcrumbs/Breadcrumbs'
import { GetMyContest } from './types/GetMyContest'

export const Dashboard: FunctionComponent = () => {
  useContestOnly()
  const routingStore = useRouting()

  const { data } = useQuery<GetMyContest>(
    gql`
      query GetMyContest {
        myContest {
          name
          shortDescription
        }
      }
    `
  )
  useEffect(() => {
    return putItem(`/contest`, data && data.myContest ? data.myContest.name : '')
  }, [data])

  return (
    <DocumentTitle title='UGrade | Dashboard'>
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
    </DocumentTitle>
  )
}
