import React from 'react'
import { Route, withRouter } from 'react-router-dom'
import DocumentTitle from 'react-document-title'
import { connect } from 'react-redux'

import { AppState } from '../stores'

import Home from './Home'
import SignInPage from './SignInPage'
import Setting from './Setting'
import SignUpPage from './SignUpPage'
import ForgotPassword from './ForgotPassword'
import Contests from './Contests'

export interface AppProps {
  title?: string
}

const App: React.SFC<AppProps> = ({ title }) => (
  <DocumentTitle title={title || "UGrade"}>
    <React.Fragment>
      <Route path='/' exact component={Home} />
      <Route path='/signin' component={SignInPage} />
      <Route path='/signup' component={SignUpPage} />
      <Route path='/setting' component={Setting} />
      <Route path='/forgot-password' component={ForgotPassword} />
      <Route path='/contests' exact component={Contests} />
      <Route path='/contests/:contest-id' component={Contests} />
    </React.Fragment>
  </DocumentTitle>
)

const mapStateToProps = (state: AppState) => ({ title: state.title, })

export default withRouter(connect(mapStateToProps)(App) as any)
