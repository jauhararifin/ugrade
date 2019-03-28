import { Markdown } from '@/components/Markdown'
import { ContestInfo } from '@/contest'
import React, { FunctionComponent } from 'react'
import { Content } from '../components/Content'

export interface OverviewViewProps {
  contest: ContestInfo
}

export const OverviewView: FunctionComponent<OverviewViewProps> = ({ contest }) => {
  return (
    <Content className='contest-overview'>
      <Markdown source={contest.description} />
    </Content>
  )
}
