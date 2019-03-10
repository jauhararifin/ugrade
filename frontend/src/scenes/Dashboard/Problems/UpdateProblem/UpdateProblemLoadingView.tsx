import React, { FunctionComponent } from 'react'
import { TwoRowLoading } from 'ugrade/components/TwoRowLoading'

import './styles.css'

export const UpdateProblemLoadingView: FunctionComponent = () => (
  <div className='contest-problem-update'>
    <TwoRowLoading />
  </div>
)
