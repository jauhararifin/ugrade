import { Location } from 'history'
import React from 'react'
import DocumentTitle from 'react-document-title'
import { connect } from 'react-redux'
import { Route, Switch, withRouter } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import './styles.css'

import { AppState } from '../stores'
import ContestDetail from './ContestDetail'
import Contests from './Contests'
import ForgotPassword from './ForgotPassword'
import Home from './Home'
import MyAccount from './MyAccount'
import Setting from './Setting'
import SignIn from './SignIn'
import SignUp from './SignUp'

export interface AppProps {
  title?: string
  location: Location
}

const App: React.SFC<AppProps> = ({ title, location }) => {
  let locationKey = '/'
  if (location.pathname.match('/signin')) locationKey = 'signin'
  else if (location.pathname.match('/signup')) locationKey = 'signup'
  else if (location.pathname.match('/setting')) locationKey = 'setting'
  else if (location.pathname.match('/account')) locationKey = 'account'
  else if (location.pathname.match('/forgot-password')) {
    locationKey = 'forgot-password'
  } else if (location.pathname.match('/contests/.+')) locationKey = 'contests/'
  else if (location.pathname.match('/contests/?')) locationKey = 'contests'

  return (
    <DocumentTitle title={title || 'UGrade'}>
      <TransitionGroup className='eat-them-all'>
        <CSSTransition timeout={300} classNames='fade' key={locationKey}>
          <Switch location={location}>
            <Route path='/' exact={true} component={Home} />
            <Route path='/signin' component={SignIn} />
            <Route path='/signup' component={SignUp} />
            <Route path='/setting' component={Setting} />
            <Route path='/account' exact={true} component={MyAccount} />
            <Route path='/forgot-password' component={ForgotPassword} />
            <Route path='/contests' exact={true} component={Contests} />
            <Route path='/contests/:contestId' component={ContestDetail} />
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </DocumentTitle>
  )
}

const mapStateToProps = (state: AppState) => ({ title: state.title })

export default withRouter(connect(mapStateToProps)(App) as any)
