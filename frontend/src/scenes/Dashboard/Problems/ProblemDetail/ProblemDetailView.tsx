import React, { FunctionComponent } from 'react'
import { Markdown } from 'ugrade/components/Markdown'
import { Problem } from 'ugrade/contest/store'
import { ContentWithHeader } from '../../components/ContentWithHeader'

import './styles.css'

export interface ProblemDetailViewProps {
  problem: Problem
}

export const ProblemDetailView: FunctionComponent<ProblemDetailViewProps> = ({
  problem,
}) => {
  return (
    <ContentWithHeader className='contest-problems' header={problem.name}>
      <div>
        <Markdown source={problem.statement} />
      </div>
    </ContentWithHeader>
  )
}
