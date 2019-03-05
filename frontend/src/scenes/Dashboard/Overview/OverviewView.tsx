import { Button, H2, Intent } from '@blueprintjs/core'
import React, { Fragment, FunctionComponent } from 'react'
import { Markdown } from 'ugrade/components/Markdown'
import { ContestInfo } from 'ugrade/contest/store'

import './styles.css'

export interface OverviewViewProps {
  contest?: ContestInfo
}

export const OverviewView: FunctionComponent<OverviewViewProps> = ({
  contest,
}) => {
  const renderLoading = () => (
    <Fragment>
      <H2 className='bp3-skeleton'>Fake Contest Title</H2>
      <p className='bp3-skeleton'>{'fake content'.repeat(100)}</p>
      <p className='bp3-skeleton'>{'fake content'.repeat(100)}</p>
    </Fragment>
  )

  return (
    <div className='contest-overview'>
      <div className='contest-description'>
        {contest ? <Markdown source={contest.description} /> : renderLoading()}
      </div>
    </div>
  )
}
