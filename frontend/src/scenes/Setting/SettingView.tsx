import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'

import './styles.css'

import BottomLink from '../../components/BottomLink'
import ProxySettingForm from './ProxySettingForm'

export interface SettingViewProps {
  showSignIn: boolean
  showSignUp: boolean
}

export const SettingView: FunctionComponent<SettingViewProps> = ({
  showSignIn,
  showSignUp,
}) => (
  <div className='plain-page'>
    <div className='setting-page-panel'>
      <div>
        <h2>Settings</h2>
      </div>
      <ProxySettingForm />
    </div>
    <BottomLink>
      <Link to='/'>Home</Link>
      {showSignUp && <Link to='/signup'>Sign Up</Link>}
      {showSignIn && <Link to='/signin'>Sign In</Link>}
    </BottomLink>
  </div>
)

SettingView.defaultProps = {
  showSignIn: true,
  showSignUp: true,
}
