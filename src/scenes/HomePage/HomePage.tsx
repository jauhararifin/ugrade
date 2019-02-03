import React from 'react'
import { Button } from '@material-ui/core'
import { connect } from 'react-redux'
import { Path, LocationState } from 'history'
import { push, CallHistoryMethodAction } from 'connected-react-router'

import './HomePage.css'

export interface HomePageProps {
  push(path: Path, state?: LocationState): CallHistoryMethodAction
}

const HomePage: React.SFC<HomePageProps> = ({ push }) => (
  <div className='home-page'>
    <h1>Welcome To UGrade</h1>
    <h2>A Simple Online Judge Using Your PC As Grader</h2>
    <Button size="large" variant="contained" color="primary" onClick={() => push('/signup')}>
      Sign Up
    </Button>
    <Button size="large" variant="contained" onClick={() => push('/signin')}>
      Sign In
    </Button>
  </div>
)

export default connect(null, { push })(HomePage)
