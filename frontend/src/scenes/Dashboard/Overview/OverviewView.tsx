import React, { FunctionComponent } from 'react'
import { Markdown } from 'ugrade/components/Markdown'
import { ContestInfo } from 'ugrade/contest/store'

import './styles.css'

export interface OverviewViewProps {
  contest: ContestInfo
}

export const OverviewView: FunctionComponent<OverviewViewProps> = ({
  contest,
}) => {
  return (
    <div className='contest-overview'>
      <div className='contest-description'>
        <Markdown source={contest.description} />
      </div>
    </div>
  )
}
