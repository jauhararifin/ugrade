import React, { FunctionComponent } from 'react'
import { TwoRowLoading } from 'ugrade/components/TwoRowLoading'

import './styles.scss'

export const ScoreboardLoadingView: FunctionComponent = () => (
  <div className='contest-scoreboard'>
    <TwoRowLoading />
  </div>
)
