import { Markdown } from '@/components/Markdown/Markdown'
import React, { FunctionComponent } from 'react'
import { ContentWithHeader } from '../../components/ContentWithHeader/ContentWithHeader'

import './styles.css'

export interface ProblemDetailViewProps {
  problem: {
    name: string
    statement: string
  }
}

export const ProblemDetailView: FunctionComponent<ProblemDetailViewProps> = ({ problem }) => {
  return (
    <ContentWithHeader className='contest-problems' header={problem.name}>
      <div>
        <Markdown source={problem.statement} />
      </div>
    </ContentWithHeader>
  )
}
