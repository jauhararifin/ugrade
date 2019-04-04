import { Markdown } from '@/components/Markdown/Markdown'
import React, { FunctionComponent } from 'react'
import { Content } from '../components/Content/Content'

export interface OverviewViewProps {
  contest: {
    description: string
  }
}

export const OverviewView: FunctionComponent<OverviewViewProps> = ({ contest }) => {
  return (
    <Content className='contest-overview'>
      <Markdown source={contest.description} />
    </Content>
  )
}
