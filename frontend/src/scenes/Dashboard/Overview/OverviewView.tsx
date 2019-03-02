import { H2 } from '@blueprintjs/core'
import React, { FunctionComponent } from 'react'
import { Markdown } from 'ugrade/components/Markdown'
import { ContestInfo } from 'ugrade/contest/store'

import './styles.css'

export interface OverviewViewProps {
  contest?: ContestInfo
}

export const OverviewView: FunctionComponent<OverviewViewProps> = ({
  contest,
}) => (
  <div className='contest-overview'>
    {contest ? (
      <Markdown source={contest.description} />
    ) : (
      <React.Fragment>
        <H2 className='bp3-skeleton'>Fake Contest Title</H2>
        <p className='bp3-skeleton'>{'fake content'.repeat(100)}</p>
        <p className='bp3-skeleton'>{'fake content'.repeat(100)}</p>
      </React.Fragment>
    )}
  </div>
)
