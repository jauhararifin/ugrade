import React from 'react'
import { Route } from 'react-router-dom'

import HomePage from './HomePage'
import LoginPage from './LoginPage'
import SettingPage from './SettingPage'

const App = () => (
  <React.Fragment>
      <Route path='/' exact component={HomePage} />
      <Route path='/signin' component={LoginPage} />
      <Route path='/signup' component={HomePage} />
      <Route path='/setting' component={SettingPage} />
  </React.Fragment>
)

export default App
