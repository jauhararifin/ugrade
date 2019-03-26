import { Card } from '@blueprintjs/core'
import React, { FunctionComponent } from 'react'

export const ContestSubmitFormLoadingView: FunctionComponent = () => {
  return <Card className='bp3-skeleton'>{'fake '.repeat(50)}</Card>
}
