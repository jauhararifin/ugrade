import React, { FunctionComponent, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { useContestOnly } from 'ugrade/auth'
import { useProblems } from 'ugrade/contest/problem'
import { Problem } from 'ugrade/contest/store'
import { ProblemDetailLoadingView } from './ProblemDetailLoadingView'
import { ProblemDetailView } from './ProblemDetailView'

export type ProblemDetailProps = RouteComponentProps<{ problemId: string }>

export const ProblemDetail: FunctionComponent<ProblemDetailProps> = ({
  match,
}) => {
  useContestOnly()
  const problems = useProblems()
  const [problem, setProblem] = useState(undefined as Problem | undefined)

  useEffect(() => {
    if (problems) setProblem(problems[match.params.problemId])
  }, [problems])

  if (!problem) return <ProblemDetailLoadingView />
  return <ProblemDetailView problem={problem} />
}
