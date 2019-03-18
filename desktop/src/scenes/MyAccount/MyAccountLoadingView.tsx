import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import BottomLink from 'ugrade/components/BottomLink'
import { TwoRowLoading } from 'ugrade/components/TwoRowLoading'

import './styles.css'

export const MyAccountLoadingView: FunctionComponent = () => (
  <div className='plain-page'>
    <div className='my-account-page-panel'>
      <TwoRowLoading />
    </div>
    <BottomLink>
      <Link to='/contest'>Dashboard</Link>
    </BottomLink>
  </div>
)
