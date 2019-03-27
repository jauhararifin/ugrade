import { useObserver } from 'mobx-react-lite'
import React, { FunctionComponent, useEffect } from 'react'
import { useContest, useProblem, useServer, useSubmission } from '../../../app'
import { useContestOnly } from '../../../common'
import { Language } from '../../../contest'
import { Problem } from '../../../problem'
import { Submission } from '../../../submission'
import { SimpleLoading } from '../components/SimpleLoading'
import { ISubmission, SubmissionsView } from './SubmissionsView'

export const Submissions: FunctionComponent = () => {
  useContestOnly()

  const serverStore = useServer()
  const submissionStore = useSubmission()
  const problemStore = useProblem()
  const contestStore = useContest()

  useEffect(() => {
    submissionStore.load()
  }, [])

  return useObserver(() => {
    const problems = problemStore.problems
    const serverClock = serverStore.serverClock
    const languages = contestStore.languages
    const mySubmissions = submissionStore.submissions || []

    if (!problems || !serverClock || !languages) return <SimpleLoading />

    const langMap: { [id: string]: Language } = {}
    for (const lang of languages) langMap[lang.id] = lang

    const noneProblem: Problem = {
      id: '',
      shortId: 'unknown',
      name: 'Unknown',
      statement: '',
      timeLimit: 0,
      tolerance: 0,
      memoryLimit: 0,
      outputLimit: 0,
      disabled: true,
    }

    const noneLanguage: Language = {
      id: '',
      name: 'Unknown',
      extensions: ['unk'],
    }

    const isubmissions = mySubmissions.map(
      (submission: Submission): ISubmission => ({
        ...submission,
        problem: problems[submission.problemId] || noneProblem,
        language: langMap[submission.languageId] || noneLanguage,
      })
    )

    return <SubmissionsView submissions={isubmissions} serverClock={serverClock} />
  })
}
