import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import HomePage from './HomePage/HomePage'

const App = () => (
  <BrowserRouter>
    <Route path='/' exact component={HomePage} />
  </BrowserRouter>
)

export default App
