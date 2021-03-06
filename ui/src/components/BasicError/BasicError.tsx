import { Button, Card, Intent, NonIdealState } from '@blueprintjs/core'
import React, { FunctionComponent } from 'react'

import './styles.css'

export interface BasicErrorProps {
  error?: Error
}

export const BasicError: FunctionComponent<BasicErrorProps> = ({ error }) => (
  <Card className='ug-basic-error'>
    <NonIdealState
      icon='error'
      title='Something When Wrong'
      description={
        <div>
          <p>We encountered some problem when loading this page.</p>
          {error && <p>{error}</p>}
        </div>
      }
      action={
        <Button onClick={window.location.reload.bind(window.location)} intent={Intent.DANGER}>
          Reload
        </Button>
      }
    />
  </Card>
)
