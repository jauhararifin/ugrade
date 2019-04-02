import { useRouting } from '@/routing'
import { useWindow } from '@/window'
import { useObserver } from 'mobx-react-lite'
import React, { FunctionComponent } from 'react'
import DocumentTitle from 'react-document-title'
import { Route, Router, Switch } from 'react-router'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { CreateContest } from './CreateContest/CreateContest'
import { Dashboard } from './Dashboard/Dashboard'
import { EnterContest } from './EnterContest/EnterContest'
import { Home } from './Home/Home'
import { NetworkStatus } from './NetworkStatus/NetworkStatus'

import './styles.css'

export const App: FunctionComponent = () => {
  const routing = useRouting()
  const window = useWindow()
  const locationKey = routing.location.pathname.split('/', 2).join('/')
  return useObserver(() => {
    const title = window.title
    const history = routing.history
    return (
      <Router history={history}>
        <DocumentTitle title={title || 'UGrade'}>
          <NetworkStatus>
            <TransitionGroup className='eat-them-all'>
              <CSSTransition timeout={300} classNames='fade' key={locationKey}>
                <Switch location={routing.location}>
                  <Route path='/' exact={true} component={Home} />
                  <Route path='/create-contest' component={CreateContest} />
                  <Route path='/enter-contest' component={EnterContest} />
                  <Route path='/contest' component={Dashboard} />
                </Switch>
              </CSSTransition>
            </TransitionGroup>
          </NetworkStatus>
        </DocumentTitle>
      </Router>
    )
  })
}
