import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'

import logo from '../../assets/images/logo.svg'
import BottomLink from '../../components/BottomLink'
import SignInForm from './SignInForm'

export const SignInView: FunctionComponent = () => (
  <div className='plain-page'>
    <div>
      <Link to='/'>
        <img src={logo} width={100} alt='logo' />
      </Link>
      <h1>Welcome To UGrade</h1>
      <SignInForm />
    </div>
    <BottomLink>
      <Link to='/forgot-password'>Forgot Password</Link>
      <Link to='/setting'>Setting</Link>
    </BottomLink>
  </div>
)
