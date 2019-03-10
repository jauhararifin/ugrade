import React, { FunctionComponent } from 'react'
import { TwoRowLoading } from 'ugrade/components/TwoRowLoading'

import './styles.css'

export const ProblemDetailLoadingView: FunctionComponent = () => (
  <div className='contest-problems'>
    <TwoRowLoading />
  </div>
)
