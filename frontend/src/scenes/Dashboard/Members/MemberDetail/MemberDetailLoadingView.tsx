import React, { FunctionComponent } from 'react'
import { TwoRowLoading } from 'ugrade/components/TwoRowLoading'

import './styles.css'

export const MemberDetailLoadingView: FunctionComponent = () => (
  <div className='member-detail'>
    <TwoRowLoading />
  </div>
)
