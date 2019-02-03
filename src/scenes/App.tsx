import React from 'react'
import { Route } from 'react-router-dom'

import HomePage from './HomePage/HomePage'
import LoginPage from './LoginPage/LoginPage'

const App = () => (
  <React.Fragment>
      <Route path='/' exact component={HomePage} />
      <Route path='/signin' component={LoginPage} />
      <Route path='/signup' component={HomePage} />
  </React.Fragment>
)

export default App
