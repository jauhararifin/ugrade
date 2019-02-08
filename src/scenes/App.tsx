import React from 'react'
import { Route, withRouter, Switch } from 'react-router-dom'
import DocumentTitle from 'react-document-title'
import { connect } from 'react-redux'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { Location } from 'history'

import "./styles.css"

import { AppState } from '../stores'
import Home from './Home'
import SignIn from './SignIn'
import Setting from './Setting'
import SignUp from './SignUp'
import ForgotPassword from './ForgotPassword'
import Contests from './Contests'
import ContestDetail from './ContestDetail'
import MyAccount from './MyAccount'

export interface AppProps {
  title?: string
  location: Location
}

const App: React.SFC<AppProps> = ({ title, location }) => (
  <DocumentTitle title={title || "UGrade"}>
    <TransitionGroup className="eat-them-all">
      <CSSTransition timeout={300} classNames="fade" key={location.key}>
        <Switch location={location}>
          <Route path='/' exact component={Home} />
          <Route path='/signin' component={SignIn} />
          <Route path='/signup' component={SignUp} />
          <Route path='/setting' component={Setting} />
          <Route path='/account' exact component={MyAccount} />
          <Route path='/forgot-password' component={ForgotPassword} />
          <Route path='/contests' exact component={Contests} />
          <Route path='/contests/:contestId' component={ContestDetail} />
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  </DocumentTitle>
)

const mapStateToProps = (state: AppState) => ({ title: state.title })

export default withRouter(connect(mapStateToProps)(App) as any)
