import { Card } from '@blueprintjs/core'
import React, { FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import './styles.css'

import logo from '../../assets/images/logo.svg'
import BottomLink from '../../components/BottomLink'
import SignInForm, { SignInFormProps } from './SignInForm'

export type SignInPageProps = SignInFormProps

const SignInPage: FunctionComponent<SignInPageProps> = props => (
  <div className='plain-page'>
    <div>
      <Link to='/'>
        <img src={logo} width={100} alt='logo' />
      </Link>
      <h1>Welcome To UGrade</h1>
      <Card className='signin-panel'>
        <h2>Sign In</h2>
        <SignInForm {...props} />
      </Card>
    </div>
    <BottomLink>
      <Link to='/signup'>Sign Up</Link>
      <Link to='/forgot-password'>Forgot Password</Link>
      <Link to='/setting'>Setting</Link>
    </BottomLink>
  </div>
)

export default connect()(SignInPage)
