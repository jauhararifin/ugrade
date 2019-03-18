import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import BottomLink from 'ugrade/components/BottomLink'
import { MyAccountPasswordForm } from './MyAccountPasswordForm'
import { MyAccountProfileForm } from './MyAccountProfileForm'

import './styles.css'

export const MyAccountView: FunctionComponent = () => (
  <div className='plain-page'>
    <div className='my-account-page-panel'>
      <div>
        <h2>Account Setting</h2>
      </div>
      <MyAccountProfileForm />
      <MyAccountPasswordForm />
    </div>
    <BottomLink>
      <Link to='/contest'>Dashboard</Link>
    </BottomLink>
  </div>
)
