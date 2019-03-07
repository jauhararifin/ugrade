import { H1 } from '@blueprintjs/core'
import React, { FunctionComponent } from 'react'
import { Markdown } from 'ugrade/components/Markdown'
import { Problem } from 'ugrade/contest/store'

import './styles.css'

export interface ProblemDetailViewProps {
  problem: Problem
}

export const ProblemDetailView: FunctionComponent<ProblemDetailViewProps> = ({
  problem,
}) => {
  return (
    <div className='contest-problems'>
      <H1 className='header'>{problem.name}</H1>
      <div>
        <Markdown source={problem.statement} />
      </div>
    </div>
  )
}
