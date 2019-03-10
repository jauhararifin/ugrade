import React, { FunctionComponent, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { useContestOnly } from 'ugrade/auth'
import { handleCommonError } from 'ugrade/common'
import { TopToaster } from 'ugrade/common/ActionToaster'
import { useProblems, useUpdateProblem } from 'ugrade/contest/problem'
import { Problem } from 'ugrade/contest/store'
import { ProblemFormValue } from '../ProblemEditor'
import { UpdateProblemLoadingView } from './UpdateProblemLoadingView'
import { UpdateProblemView } from './UpdateProblemView'

export type UpdateProblemProps = RouteComponentProps<{ problemId: string }>

export const UpdateProblem: FunctionComponent<UpdateProblemProps> = ({
  match,
}) => {
  useContestOnly()
  const updateProblem = useUpdateProblem()
  const problems = useProblems()

  const [problem, setProblem] = useState(undefined as Problem | undefined)
  useEffect(() => {
    if (problems) setProblem(problems[match.params.problemId])
  }, [problems])

  const handleSubmit = async (value: ProblemFormValue) => {
    try {
      if (problem) {
        await updateProblem(
          problem.id,
          value.shortId,
          value.name,
          value.statement,
          value.type,
          value.disabled,
          value.timeLimit,
          value.tolerance,
          value.memoryLimit,
          value.outputLimit
        )
        TopToaster.showSuccessToast('Problem Updated')
      }
    } catch (error) {
      if (!handleCommonError(error)) throw error
    }
  }

  if (!problem) return <UpdateProblemLoadingView />
  return <UpdateProblemView problem={problem} onSubmit={handleSubmit} />
}
