import React from 'react'
import { Button, Intent } from '@blueprintjs/core'
import { connect } from 'react-redux'
import { Path, LocationState } from 'history'
import { Link } from 'react-router-dom'
import { push, CallHistoryMethodAction } from 'connected-react-router'

import logo from '../../assets/images/logo.svg'

import './styles.css'
import BottomLink from '../../components/BottomLink'

export interface HomePageProps {
  push(path: Path, state?: LocationState): CallHistoryMethodAction
}

const HomePage: React.SFC<HomePageProps> = ({ push }) => (
  <div className="home-page">
    <div className="home-panel">
      <Link to="/">
        <img src={logo} width={100} alt="logo" />
      </Link>
      <h1>Welcom To UGrade</h1>
      <h4>
        There is no one who loves pain itself, who seeks after it and wants to
        have it, simply because it is pain...
      </h4>
      <div className="home-actions">
        <Button fill large className="item" onClick={() => push('/signup')}>
          Sign Up
        </Button>
        <Button fill large className="item" intent={Intent.SUCCESS} onClick={() => push('/signin')}>
          Sign In
        </Button>
      </div>
    </div>
    <BottomLink>
      <Link to="/setting">Settings</Link>
    </BottomLink>
  </div>
)

export default connect(null, { push })(HomePage)
