import React, { FunctionComponent } from 'react'
import { TwoRowLoading } from 'ugrade/components/TwoRowLoading'

import './styles.css'

export const SubmissionsLoadingView: FunctionComponent = () => (
  <div className='contest-submissions'>
    <TwoRowLoading />
  </div>
)
