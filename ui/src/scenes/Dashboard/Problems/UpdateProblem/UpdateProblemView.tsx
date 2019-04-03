import React, { FunctionComponent } from 'react'
import { ContentWithHeader } from '../../components/ContentWithHeader/ContentWithHeader'
import { ProblemEditor, ProblemFormValue } from '../ProblemEditor/ProblemEditor'

export interface UpdateProblemViewProps {
  problem: {
    shortId: string
    name: string
    statement: string
    disabled: boolean
    timeLimit: number
    tolerance: number
    memoryLimit: number
    outputLimit: number
  }
  onSubmit: (value: ProblemFormValue) => any
}

export const UpdateProblemView: FunctionComponent<UpdateProblemViewProps> = ({ problem, onSubmit }) => (
  <ContentWithHeader className='contest-problem-update' header='Update Problem'>
    <ProblemEditor problem={problem} onSubmit={onSubmit} />
  </ContentWithHeader>
)
