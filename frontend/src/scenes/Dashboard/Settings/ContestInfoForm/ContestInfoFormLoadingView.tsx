import React, { FunctionComponent } from 'react'
import { TwoRowLoading } from 'ugrade/components/TwoRowLoading'

import './styles.css'

export const ContestInfoFormLoadingView: FunctionComponent = () => (
  <div className='contest-info-form'>
    <TwoRowLoading />
  </div>
)
