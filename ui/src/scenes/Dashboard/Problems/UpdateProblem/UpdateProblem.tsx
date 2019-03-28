import { useProblem, useRouting } from '@/app'
import { showErrorToast, showSuccessToast, useContestOnly } from '@/common'
import { useObserver } from 'mobx-react-lite'
import React, { FunctionComponent } from 'react'
import { RouteComponentProps } from 'react-router'
import { SimpleLoading } from '../../components/SimpleLoading'
import { ProblemFormValue } from '../ProblemEditor'
import { UpdateProblemView } from './UpdateProblemView'

export type UpdateProblemProps = RouteComponentProps<{ problemId: string }>

export const UpdateProblem: FunctionComponent<UpdateProblemProps> = ({ match }) => {
  useContestOnly()
  const problemStore = useProblem()
  const routingStore = useRouting()

  const handleSubmit = async (value: ProblemFormValue) => {
    try {
      if (problemStore.problems && problemStore.problems[match.params.problemId]) {
        const problem = problemStore.problems[match.params.problemId]
        const newProb = await problemStore.update({
          id: problem.id,
          ...value,
        })
        showSuccessToast('Problem Updated')
        routingStore.push(`/contest/problems/${newProb.id}`)
      }
    } catch (error) {
      showErrorToast(error)
    }
  }

  return useObserver(() => {
    const problems = problemStore.problems
    if (!problems) return <SimpleLoading />
    const problem = problems[match.params.problemId]
    if (!problem) return <SimpleLoading />
    return <UpdateProblemView problem={problem} onSubmit={handleSubmit} />
  })
}
