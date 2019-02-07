import React from 'react'
import { Route, withRouter } from 'react-router-dom'
import DocumentTitle from 'react-document-title'
import { connect } from 'react-redux'

import { AppState } from '../stores'

import Home from './Home'
import SignIn from './SignIn'
import Setting from './Setting'
import SignUp from './SignUp'
import ForgotPassword from './ForgotPassword'
import Contests from './Contests'
import ContestDetail from './ContestDetail'

export interface AppProps {
  title?: string
}

const App: React.SFC<AppProps> = ({ title }) => (
  <DocumentTitle title={title || "UGrade"}>
    <React.Fragment>
      <Route path='/' exact component={Home} />
      <Route path='/signin' component={SignIn} />
      <Route path='/signup' component={SignUp} />
      <Route path='/setting' component={Setting} />
      <Route path='/forgot-password' component={ForgotPassword} />
      <Route path='/contests' exact component={Contests} />
      <Route path='/contests/:contestId' component={ContestDetail} />
    </React.Fragment>
  </DocumentTitle>
)

const mapStateToProps = (state: AppState) => ({ title: state.title, })

export default withRouter(connect(mapStateToProps)(App) as any)
