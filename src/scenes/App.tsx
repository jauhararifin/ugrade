import React from 'react'
import { Route, withRouter } from 'react-router-dom'
import DocumentTitle from 'react-document-title'
import { connect } from 'react-redux'

import { AppState } from '../stores'

import HomePage from './HomePage'
import SignInPage from './SignInPage'
import SettingPage from './SettingPage'
import SignUpPage from './SignUpPage'
import ForgotPasswordPage from './ForgotPasswordPage'
import ContestsPage from './ContestsPage'

export interface AppProps {
  title?: string
}

const App: React.SFC<AppProps> = ({ title }) => (
  <DocumentTitle title={title || "UGrade"}>
    <React.Fragment>
      <Route path='/' exact component={HomePage} />
      <Route path='/signin' component={SignInPage} />
      <Route path='/signup' component={SignUpPage} />
      <Route path='/setting' component={SettingPage} />
      <Route path='/forgot-password' component={ForgotPasswordPage} />
      <Route path='/contests' component={ContestsPage} />
    </React.Fragment>
  </DocumentTitle>
)

const mapStateToProps = (state: AppState) => ({ title: state.title, })

export default withRouter(connect(mapStateToProps)(App) as any)
