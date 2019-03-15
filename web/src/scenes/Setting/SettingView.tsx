import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import BottomLink from 'ugrade/components/BottomLink'
import { ProxySettingForm } from './ProxySettingForm'

import './styles.css'

export interface SettingViewProps {
  signedIn: boolean
}

export const SettingView: FunctionComponent<SettingViewProps> = ({
  signedIn,
}) => (
  <div className='plain-page'>
    <div className='setting-page-panel'>
      <div>
        <h2>Settings</h2>
      </div>
      <ProxySettingForm />
    </div>
    <BottomLink>
      {signedIn && <Link to='/contest'>Dashboard</Link>}
      {!signedIn && <Link to='/'>Home</Link>}
      {!signedIn && <Link to='/create-contest'>Create Contest</Link>}
      {!signedIn && <Link to='/enter-contest'>Enter Contest</Link>}
    </BottomLink>
  </div>
)
