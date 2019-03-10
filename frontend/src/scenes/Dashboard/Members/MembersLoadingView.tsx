import React, { FunctionComponent } from 'react'
import { TwoRowLoading } from 'ugrade/components/TwoRowLoading'

import './styles.css'

export const MembersLoadingView: FunctionComponent = () => (
  <div className='contest-members'>
    <TwoRowLoading />
  </div>
)
