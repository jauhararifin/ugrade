import { Card, H1 } from '@blueprintjs/core'
import React, { FunctionComponent } from 'react'

export const TwoRowLoading: FunctionComponent = () => (
  <div>
    <H1 className='bp3-skeleton'>Fake</H1>
    <Card className='bp3-skeleton'>{'Fake '.repeat(100)}</Card>
  </div>
)
