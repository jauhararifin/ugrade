import { H2 } from '@blueprintjs/core'
import React, { FunctionComponent } from 'react'

import './styles.css'

import { Markdown } from '../../../components/Markdown'
import { Contest } from '../../../stores/Contest'

export interface OverviewPageProps {
  contest?: Contest
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
