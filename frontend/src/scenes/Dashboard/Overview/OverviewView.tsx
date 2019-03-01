import { H2 } from '@blueprintjs/core'
import React, { FunctionComponent } from 'react'
import { Markdown } from 'ugrade/components/Markdown'
import { ContestInfo } from 'ugrade/stores/Contest'

import './styles.css'

export interface OverviewPageProps {
  contest?: ContestInfo
}

export const OverviewPage: FunctionComponent<OverviewPageProps> = ({
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

export default OverviewPage
