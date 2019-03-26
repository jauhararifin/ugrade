import { observer } from 'mobx-react-lite'
import React, { FunctionComponent } from 'react'
import DocumentTitle from 'react-document-title'
import { Route, Router, Switch } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { NetworkStatus } from '../components/NetworkStatus'
import { CreateContest } from './CreateContest'
import { Home } from './Home'

import { useRouting, useWindow } from '../app'
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
              </Switch>
            </CSSTransition>
          </TransitionGroup>
        </NetworkStatus>
      </DocumentTitle>
    </Router>
  )
})
