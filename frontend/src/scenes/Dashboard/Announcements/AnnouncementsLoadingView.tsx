import React, { FunctionComponent } from 'react'
import { TwoRowLoading } from 'ugrade/components/TwoRowLoading'

import './styles.css'

export const AnnouncementsLoadingView: FunctionComponent = () => {
  return (
    <div className='contest-announcements'>
      <TwoRowLoading />
    </div>
  )
}
