import { Location } from 'history'
import React from 'react'
import DocumentTitle from 'react-document-title'
import { connect } from 'react-redux'
import { Route, Switch, withRouter } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import './styles.css'

import { AppState } from '../stores'
import CreateContest from './CreateContest'
import EnterContest from './EnterContest/EnterContest'
import Home from './Home'
import MyAccount from './MyAccount'
import Setting from './Setting'

export interface AppProps {
  title?: string
  location: Location
}

const App: React.FunctionComponent<AppProps> = ({ title, location }) => {
  const locationKey = location.pathname.split('/', 2).join('/')

  return (
    <DocumentTitle title={title || 'UGrade'}>
      <TransitionGroup className='eat-them-all'>
        <CSSTransition timeout={300} classNames='fade' key={locationKey}>
          <Switch location={location}>
            <Route path='/' exact={true} component={Home} />
            <Route path='/enter-contest' component={EnterContest} />
            <Route path='/create-contest' component={CreateContest} />
            <Route path='/setting' component={Setting} />
            <Route path='/account' exact={true} component={MyAccount} />
            {/* <Route path='/forgot-password' component={ForgotPassword} /> */}
            {/* <Route path='/contests' exact={true} component={Contests} /> */}
            {/* <Route path='/contests/:contestId' component={ContestDetail} /> */}
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </DocumentTitle>
  )
}

const mapStateToProps = (state: AppState) => ({ title: state.title })

export default withRouter(connect(mapStateToProps)(App) as any)
