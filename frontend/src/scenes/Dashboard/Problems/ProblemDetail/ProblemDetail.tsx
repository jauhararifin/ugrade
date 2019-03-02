import React, { FunctionComponent, useEffect, useState } from 'react'
import { useContestOnly } from 'ugrade/auth'
import { useProblems } from 'ugrade/contest/problem'
import { Problem } from 'ugrade/contest/store'
import { useLocation } from 'ugrade/router'
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

  return <ProblemDetailView problem={problem} />
}
