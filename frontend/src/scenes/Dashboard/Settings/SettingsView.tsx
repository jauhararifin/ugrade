import { H1 } from '@blueprintjs/core'
import React, { FunctionComponent } from 'react'
import { ContestInfoForm } from './ContestInfoForm'

import './styles.css'

export const SettingsView: FunctionComponent = () => {
  return (
    <div className='contest-settings'>
      <H1 className='header'>Contest Settings</H1>
      <div>
        <ContestInfoForm />
      </div>
    </div>
  )
}
