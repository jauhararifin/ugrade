import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'

import logo from '../../assets/images/logo.svg'
import BottomLink from '../../components/BottomLink'
import ForgotPasswordForm from './ForgotPasswordForm'

export const ForgotPasswordView: FunctionComponent = () => (
  <div className='plain-page'>
    <div>
      <Link to='/'>
        <img src={logo} width={100} alt='logo' />
      </Link>
      <h1>Welcome To UGrade</h1>
      <ForgotPasswordForm />
    </div>
    <BottomLink>
      <Link to='/signup'>Sign Up</Link>
      <Link to='/signin'>Sign In</Link>
      <Link to='/setting'>Setting</Link>
    </BottomLink>
  </div>
)

export default ForgotPasswordView
