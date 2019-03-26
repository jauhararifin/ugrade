import { observer } from 'mobx-react-lite'
import React, { FunctionComponent } from 'react'
import DocumentTitle from 'react-document-title'
import { Route, Router, Switch } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { useRouting, useWindow } from '../app'
import { NetworkStatus } from '../components/NetworkStatus'
import { CreateContest } from './CreateContest'
import { EnterContest } from './EnterContest'
import { Home } from './Home'

import { Dashboard } from './Dashboard'
import './styles.css'

export const App: FunctionComponent = observer(() => {
  const routing = useRouting()
  const windowStore = useWindow()
  const locationKey = routing.location.pathname.split('/', 2).join('/')
  return (
    <Router history={routing.history}>
      <DocumentTitle title={windowStore.title || 'UGrade'}>
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
