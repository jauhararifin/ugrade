import { TwoRowLoading } from '@/components/TwoRowLoading/TwoRowLoading'
import React, { FunctionComponent } from 'react'

import './styles.css'

export const SidebarLoadingView: FunctionComponent = () => {
  return (
    <div className='contest-sidebar'>
      <TwoRowLoading />
    </div>
  )
}
