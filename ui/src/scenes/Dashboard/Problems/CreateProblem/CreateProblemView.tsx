import React, { FunctionComponent } from 'react'
import { ContentWithHeader } from '../../components/ContentWithHeader'
import { ProblemEditor, ProblemFormValue } from '../ProblemEditor'

export interface CreateProblemViewProps {
  onSubmit: (value: ProblemFormValue) => any
}

export const CreateProblemView: FunctionComponent<CreateProblemViewProps> = ({ onSubmit }) => (
  <ContentWithHeader className='contest-problem-create' header='Create Problem'>
    <ProblemEditor onSubmit={onSubmit} />
  </ContentWithHeader>
)
