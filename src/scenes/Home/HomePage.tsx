import React from 'react'
import { Button, Intent } from '@blueprintjs/core'

import './styles.css'
import logo from '../../assets/images/logo.svg'
import BottomLink from '../../components/BottomLink'

export interface HomePageProps {
  onLogoClick: () => any
  onSettingClick: () => any
  onSignInClick: () => any
  onSignUpClick: () => any
}

const HomePage: React.SFC<HomePageProps> = ({ onLogoClick, onSettingClick, onSignInClick, onSignUpClick }) => (
  <div className="home-page">
    <div className="home-panel">
      <a onClick={onLogoClick}>
        <img src={logo} width={100} alt="logo" />
      </a>
      <h1>Welcome To UGrade</h1>
      <h4>
        There is no one who loves pain itself, who seeks after it and wants to
        have it, simply because it is pain...
      </h4>
      <div className="home-actions">
        <Button fill large className="item" onClick={onSignUpClick}>
          Sign Up
        </Button>
        <Button fill large className="item" intent={Intent.SUCCESS} onClick={onSignInClick}>
          Sign In
        </Button>
      </div>
    </div>
    <BottomLink>
      <a onClick={onSettingClick}>Settings</a>
    </BottomLink>
  </div>
)

export default HomePage
