import React, { FunctionComponent, useEffect, useState } from 'react'
import { useContestOnly } from 'ugrade/auth'
import { useProblems } from 'ugrade/contest/problem'
import { Problem } from 'ugrade/contest/store'
import { useLocation } from 'ugrade/router'
import { ProblemDetailLoadingView } from './ProblemDetailLoadingView'
import { ProblemDetailView } from './ProblemDetailView'

export const ProblemDetail: FunctionComponent = () => {
  useContestOnly()
  const problems = useProblems()
  const location = useLocation()
  const [problem, setProblem] = useState(undefined as Problem | undefined)

  useEffect(() => {
    const match = location.pathname.match(
      /^\/contest\/problems\/([a-zA-Z0-9]+)\/?$/
    )
    if (match && problems) setProblem(problems[match[1]])
  }, [problems, location])

  if (!problem) return <ProblemDetailLoadingView />

  return <ProblemDetailView problem={problem} />
}
