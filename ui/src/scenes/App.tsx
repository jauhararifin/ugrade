import { observer, useObservable } from 'mobx-react-lite'
import React, { FunctionComponent } from 'react'
import DocumentTitle from 'react-document-title'
import { Route, Router, Switch } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { useTitle } from '../common'
import { NetworkStatus } from '../components/NetworkStatus'
import { history, routingStore } from '../router'
import { CreateContest } from './CreateContest'
import { Home } from './Home'

import './styles.css'

export const App: FunctionComponent = observer(() => {
  const routing = useObservable(routingStore)
  const titleStore = useTitle()
  const locationKey = routing.location.pathname.split('/', 2).join('/')
  return (
    <Router history={history}>
      <DocumentTitle title={titleStore.title || 'UGrade'}>
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
