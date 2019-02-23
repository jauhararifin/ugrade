import React, { FunctionComponent, ReactNode } from 'react'
import { Link } from 'react-router-dom'

import logo from '../../assets/images/logo.svg'

import BottomLink from '../../components/BottomLink'

export interface EnterContestViewProps {
  children: ReactNode
}

export const EnterContestView: FunctionComponent = ({ children }) => (
  <div className='plain-page'>
    <div>
      <Link to='/'>
        <img src={logo} width={100} alt='logo' />
      </Link>
      <h1>Welcome To UGrade</h1>
      {children}
    </div>
    <BottomLink>
      <Link to='/create-contest'>Create Contest</Link>
      <Link to='/setting'>Setting</Link>
    </BottomLink>
  </div>
)
