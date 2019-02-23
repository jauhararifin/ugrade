import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'

import logo from '../../assets/images/logo.svg'

import BottomLink from '../../components/BottomLink'
import EnterContestForm from './EnterContestForm'

export const EnterContestView: FunctionComponent = () => (
  <div className='plain-page'>
    <div>
      <Link to='/'>
        <img src={logo} width={100} alt='logo' />
      </Link>
      <h1>Welcome To UGrade</h1>
      <EnterContestForm />
    </div>
    <BottomLink>
      <Link to='/create-contest'>Create Contest</Link>
      <Link to='/setting'>Setting</Link>
    </BottomLink>
  </div>
)
