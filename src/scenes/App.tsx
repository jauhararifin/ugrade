import React from 'react'
import { Route } from 'react-router-dom'

import HomePage from './HomePage/HomePage'
import LoginPage from './LoginPage/LoginPage'
import SettingPage from './SettingPage/SettingPage'
import { MuiThemeProvider } from '@material-ui/core'
import theme from '../themes/theme'

const App = () => (
  <MuiThemeProvider theme={theme}>
      <Route path='/' exact component={HomePage} />
      <Route path='/signin' component={LoginPage} />
      <Route path='/signup' component={HomePage} />
      <Route path='/setting' component={SettingPage} />
  </MuiThemeProvider>
)

export default App
