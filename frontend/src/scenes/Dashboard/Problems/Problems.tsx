import React, { FunctionComponent } from 'react'
import { useContestOnly } from 'ugrade/auth'
import { useProblemList } from 'ugrade/contest/problem'
import { Problem } from 'ugrade/contest/store'
import { usePush } from 'ugrade/router'
import { ProblemsView } from './ProblemsView'

export const Problems: FunctionComponent = () => {
  useContestOnly()
  const problems = useProblemList()
  const push = usePush()

  const handleProblemChoose = (problem: Problem) => {
    push(`/contest/problems/${problem.id}`)
  }
  return <ProblemsView problems={problems} onChoose={handleProblemChoose} />
}
