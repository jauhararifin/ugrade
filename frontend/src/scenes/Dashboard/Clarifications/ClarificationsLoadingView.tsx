import React, { FunctionComponent } from 'react'
import { TwoRowLoading } from 'ugrade/components/TwoRowLoading'

import './styles.css'

export const ClarificationsLoadingView: FunctionComponent = () => {
  return (
    <div className='contest-clarifications'>
      <TwoRowLoading />
    </div>
  )
}
