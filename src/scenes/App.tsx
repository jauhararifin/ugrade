import React from 'react'
import { Route } from 'react-router-dom'
import DocumentTitle from 'react-document-title'
import { connect } from 'react-redux'

import { AppState } from '../reducers'

import HomePage from './HomePage'
import SignInPage from './SignInPage'
import SettingPage from './SettingPage'
import SignUpPage from './SignUpPage'

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
    </React.Fragment>
  </DocumentTitle>
)

const mapStateToProps = (state: AppState) => ({ title: state.title })

export default connect(mapStateToProps)(App)
