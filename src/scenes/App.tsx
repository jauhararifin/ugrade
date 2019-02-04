import React from 'react'
import { Route } from 'react-router-dom'

import HomePage from './HomePage'
import SignInPage from './SignInPage'
import SettingPage from './SettingPage'
import SignUpPage from './SignUpPage'

const App = () => (
  <React.Fragment>
      <Route path='/' exact component={HomePage} />
      <Route path='/signin' component={SignInPage} />
      <Route path='/signup' component={SignUpPage} />
      <Route path='/setting' component={SettingPage} />
  </React.Fragment>
)

export default App
