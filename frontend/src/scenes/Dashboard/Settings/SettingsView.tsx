import { Card, H1 } from '@blueprintjs/core'
import classnames from 'classnames'
import React, { FunctionComponent } from 'react'
import { ContestInfoForm } from './ContestInfoForm'

import './styles.css'

export const SettingsView: FunctionComponent = () => {
  const loading = false
  return (
    <div className='contest-settings'>
      <H1 className={classnames('header', { 'bp3-skeleton': loading })}>
        Contest Settings
      </H1>
      <div>
        {loading && (
          <Card className='bp3-skeleton item'>{'lorem ipsum'.repeat(100)}</Card>
        )}
        <ContestInfoForm />
      </div>
    </div>
  )
}
