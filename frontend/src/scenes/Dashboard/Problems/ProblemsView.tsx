import { Card, H1, H3, H4 } from '@blueprintjs/core'
import classnames from 'classnames'
import React, { FunctionComponent } from 'react'
import { Problem } from 'ugrade/contest/store'

import './styles.css'

export interface ProblemsViewProps {
  problems?: Problem[]
  onChoose?: (problem: Problem) => any
}

export const ProblemsView: FunctionComponent<ProblemsViewProps> = ({
  problems,
  onChoose,
}) => {
  const loading = !problems

  const generateOnClickCallback = (problem: Problem) => () => {
    if (onChoose) onChoose(problem)
  }

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
            <Card
              key={problem.id}
              className='item'
              onClick={generateOnClickCallback(problem)}
            >
              <div className='header'>
                <H4 className='title'>{problem.name}</H4>
              </div>
            </Card>
          ))}
      </div>
    </div>
  )
}
