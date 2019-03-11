import React, { FunctionComponent } from 'react'
import { Markdown } from 'ugrade/components/Markdown'
import { ContestInfo } from 'ugrade/contest/store'
import { Content } from '../components/Content'

export interface OverviewViewProps {
  contest: ContestInfo
}

export const OverviewView: FunctionComponent<OverviewViewProps> = ({
  contest,
}) => {
  return (
    <Content className='contest-overview'>
      <div className='contest-description'>
        <Markdown source={contest.description} />
      </div>
    </Content>
  )
}
