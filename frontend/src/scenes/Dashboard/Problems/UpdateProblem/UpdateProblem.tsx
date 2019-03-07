import React, { FunctionComponent, useEffect, useState } from 'react'
import { useContestOnly } from 'ugrade/auth'
import { handleCommonError } from 'ugrade/common'
import { TopToaster } from 'ugrade/common/ActionToaster'
import { useProblems, useUpdateProblem } from 'ugrade/contest/problem'
import { Problem } from 'ugrade/contest/store'
import { useLocation } from 'ugrade/router'
import { ProblemFormValue } from '../ProblemEditor'
import { UpdateProblemLoadingView } from './UpdateProblemLoadingView'
import { UpdateProblemView } from './UpdateProblemView'

export const UpdateProblem: FunctionComponent = () => {
  useContestOnly()
  const updateProblem = useUpdateProblem()
  const location = useLocation()
  const problems = useProblems()

  const [problem, setProblem] = useState(undefined as Problem | undefined)
  useEffect(() => {
    const match = location.pathname.match(
      /^\/contest\/problems\/([a-zA-Z0-9]+)\/edit\/?$/
    )
    if (match && problems) setProblem(problems[match[1]])
  }, [problems, location])

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
