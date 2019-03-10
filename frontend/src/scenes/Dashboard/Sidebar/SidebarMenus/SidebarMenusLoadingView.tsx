import { Button } from '@blueprintjs/core'
import React, { FunctionComponent } from 'react'

export const SidebarMenuLoadingView: FunctionComponent = () => (
  <div className='bp3-skeleton'>
    {[0, 1, 2].map(i => (
      <Button key={i} fill={true} text='Fake' />
    ))}
  </div>
)
