import { H1 } from '@blueprintjs/core'
import React, { FunctionComponent } from 'react'
import { ProblemEditor, ProblemFormValue } from '../ProblemEditor'

import './styles.css'

export interface CreateProblemViewProps {
  onSubmit: (value: ProblemFormValue) => any
}

export const CreateProblemView: FunctionComponent<CreateProblemViewProps> = ({
  onSubmit,
}) => (
  <div className='contest-problem-create'>
    <H1 className='header'>Create Problem</H1>
    <ProblemEditor onSubmit={onSubmit} />
  </div>
)
