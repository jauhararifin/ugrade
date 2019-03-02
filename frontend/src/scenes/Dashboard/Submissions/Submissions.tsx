import React, { FunctionComponent } from 'react'
import { useMappedState } from 'redux-react-hook'
import { useContestOnly } from 'ugrade/auth'
import { useProblems } from 'ugrade/contest/problem'
import {
  getLanguagesMap,
  Language,
  Problem,
  ProblemType,
  Submission,
} from 'ugrade/contest/store'
import { useSubmissionList } from 'ugrade/contest/submission'
import { useServerClock } from 'ugrade/server'
import { ISubmission, SubmissionsView } from './SubmissionsView'

export const Submissions: FunctionComponent = () => {
  useContestOnly()
  const serverClock = useServerClock(60 * 1000)
  const submissions = useSubmissionList()
  const problems = useProblems()
  const languages = useMappedState(getLanguagesMap)

  if (problems && languages) {
    const mySubmissions = submissions || []

    const noneProblem: Problem = {
      id: '',
      shortId: 'unknown',
      name: 'Unknown',
      statement: '',
      type: ProblemType.PROBLEM_TYPE_BATCH,
      timeLimit: 0,
      tolerance: 0,
      memoryLimit: 0,
      outputLimit: 0,
      order: 0,
    }

    const noneLanguage: Language = {
      id: '',
      name: 'Unknown',
    }

    const isubmissions = mySubmissions.map(
      (submission: Submission): ISubmission => ({
        ...submission,
        problem: problems[submission.problemId] || noneProblem,
        language: languages[submission.languageId] || noneLanguage,
      })
    )

    return (
      <SubmissionsView submissions={isubmissions} serverClock={serverClock} />
    )
  }
  return <SubmissionsView />
}
