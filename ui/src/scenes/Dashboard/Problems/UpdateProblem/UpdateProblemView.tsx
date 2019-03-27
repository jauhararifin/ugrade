import React, { FunctionComponent } from 'react'
import { Problem } from '../../../../problem'
import { ContentWithHeader } from '../../components/ContentWithHeader'
import { ProblemEditor, ProblemFormValue } from '../ProblemEditor'

export interface UpdateProblemViewProps {
  problem: Problem
  onSubmit: (value: ProblemFormValue) => any
}

export const UpdateProblemView: FunctionComponent<UpdateProblemViewProps> = ({ problem, onSubmit }) => (
  <ContentWithHeader className='contest-problem-update' header='Update Problem'>
    <ProblemEditor problem={problem} onSubmit={onSubmit} />
  </ContentWithHeader>
)
