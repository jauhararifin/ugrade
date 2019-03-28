import { useProblem } from '@/app'
import { useContestOnly } from '@/common'
import { useObserver } from 'mobx-react-lite'
import React, { FunctionComponent } from 'react'
import { RouteComponentProps } from 'react-router'
import { SimpleLoading } from '../../components/SimpleLoading'
import { ProblemDetailView } from './ProblemDetailView'

export type ProblemDetailProps = RouteComponentProps<{ problemId: string }>

export const ProblemDetail: FunctionComponent<ProblemDetailProps> = ({ match }) => {
  useContestOnly()
  const problemStore = useProblem()
  return useObserver(() => {
    const problem = problemStore.problems && problemStore.problems[match.params.problemId]
    if (!problem) return <SimpleLoading />
    return <ProblemDetailView problem={problem} />
  })
}
