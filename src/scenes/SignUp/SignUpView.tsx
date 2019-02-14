import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'

import './styles.css'

import logo from '../../assets/images/logo.svg'
import BottomLink from '../../components/BottomLink'
import SignUpForm from './SignUpForm'

export const SignUpView: FunctionComponent = () => (
  <div className='plain-page'>
    <div>
      <Link to='/'>
        <img src={logo} width={100} alt='logo' />
      </Link>
      <h1>Welcome To UGrade</h1>
      <SignUpForm />
    </div>
    <BottomLink>
      <Link to='/signin'>Sign In</Link>
      <Link to='/setting'>Setting</Link>
    </BottomLink>
  </div>
)
