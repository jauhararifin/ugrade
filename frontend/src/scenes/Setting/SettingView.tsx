import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import BottomLink from 'ugrade/components/BottomLink'
import { ProxySettingForm } from './ProxySettingForm'

import './styles.css'

export interface SettingViewProps {
  showCreateContest: boolean
  showEnterContest: boolean
}

export const SettingView: FunctionComponent<SettingViewProps> = ({
  showCreateContest,
  showEnterContest,
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
      {showCreateContest && <Link to='/create-contest'>Create Contest</Link>}
      {showEnterContest && <Link to='/enter-contest'>Enter Contest</Link>}
    </BottomLink>
  </div>
)
