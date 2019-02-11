import { H1, H2 } from '@blueprintjs/core'
import classnames from 'classnames'
import 'github-markdown-css'
import React, { FunctionComponent } from 'react'
import ReactMarkdown from 'react-markdown'

import { Problem } from '../../../stores/Contest'
import './styles.css'

export interface ProblemDetailViewProps {
  problem?: Problem
}

export const ProblemDetailView: FunctionComponent<ProblemDetailViewProps> = ({
  problem,
}) => {
  const loading = !problem
  return (
    <div className='contest-problems'>
      <H1 className={classnames('header', { 'bp3-skeleton': loading })}>
        {problem ? problem.name : 'Fake Problem Title'}
      </H1>
      <div>
        {problem ? (
          <ReactMarkdown className='markdown-body' source={problem.statement} />
        ) : (
          <React.Fragment>
            <H2 className='bp3-skeleton'>Fake Contest Title</H2>
            <p className='bp3-skeleton'>{'fake content'.repeat(100)}</p>
            <p className='bp3-skeleton'>{'fake content'.repeat(100)}</p>
          </React.Fragment>
        )}
      </div>
    </div>
  )
}

export default ProblemDetailView
