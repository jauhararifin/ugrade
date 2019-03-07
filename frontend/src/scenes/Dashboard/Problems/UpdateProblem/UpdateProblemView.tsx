import { H1 } from '@blueprintjs/core'
import React, { FunctionComponent } from 'react'
import { Problem } from 'ugrade/contest/store'
import { ProblemEditor, ProblemFormValue } from '../ProblemEditor'

import './styles.css'

export interface UpdateProblemViewProps {
  problem: Problem
  onSubmit: (value: ProblemFormValue) => any
}

export const UpdateProblemView: FunctionComponent<UpdateProblemViewProps> = ({
  problem,
  onSubmit,
}) => (
  <div className='contest-problem-update'>
    <H1 className='header'>Update Problem</H1>
    <ProblemEditor problem={problem} onSubmit={onSubmit} />
  </div>
)
