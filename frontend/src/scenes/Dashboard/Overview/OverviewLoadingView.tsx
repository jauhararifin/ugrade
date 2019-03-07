import React, { FunctionComponent } from 'react'
import { TwoRowLoading } from 'ugrade/components/TwoRowLoading'

import './styles.css'

export const OverviewLoadingView: FunctionComponent = () => (
  <div className='contest-overview'>
    <div className='contest-description'>
      <TwoRowLoading />
    </div>
  </div>
)
