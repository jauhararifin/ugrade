import React, { FunctionComponent } from 'react'
import { TwoRowLoading } from '../../../components/TwoRowLoading'

import './styles.css'

export const SidebarLoadingView: FunctionComponent = () => {
  return (
    <div className='contest-sidebar'>
      <TwoRowLoading />
    </div>
  )
}
