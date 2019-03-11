import React, { FunctionComponent } from 'react'
import { Problem } from 'ugrade/contest/store'
import { ContentWithHeader } from '../../components/ContentWithHeader'
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
  <ContentWithHeader className='contest-problem-update' header='Update Problem'>
    <ProblemEditor problem={problem} onSubmit={onSubmit} />
  </ContentWithHeader>
)
