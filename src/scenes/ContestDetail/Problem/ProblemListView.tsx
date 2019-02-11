import { Card, H1, H3 } from '@blueprintjs/core'
import classnames from 'classnames'
import 'github-markdown-css'
import React, { FunctionComponent } from 'react'

import './styles.css'

import { Problem } from '../../../services/problem'

export interface ProblemListViewProps {
  problems?: Problem[]
}

export const ProblemListView: FunctionComponent<ProblemListViewProps> = ({
  problems,
}) => {
  const loading = !problems
  return (
    <div className='contest-problems'>
      <H1 className={classnames('header', { 'bp3-skeleton': loading })}>
        Problems
      </H1>
      <div>
        {loading && (
          <Card className='bp3-skeleton item'>{'lorem ipsum'.repeat(100)}</Card>
        )}

        {problems && problems.length === 0 && <H3>No Problems</H3>}

        {problems &&
          problems.map(problem => (
            <Card key={problem.id} className='item'>
              <div className='header'>
                <H3 className='title'>{problem.name}</H3>
              </div>
            </Card>
          ))}
      </div>
    </div>
  )
}

export default ProblemListView
