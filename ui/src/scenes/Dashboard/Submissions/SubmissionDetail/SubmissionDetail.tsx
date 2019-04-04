import { useContestOnly } from '@/auth'
import { useServerClock } from '@/window'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { SubmissionDetailView } from './SubmissionDetailView'

export interface SubmissionDetailProps {
  submission?: {
    id: string
    issuedTime: Date
    sourceCode: string
    problem: {
      id: string
      name: string
    }
    language: {
      id: string
      name: string
    }
    verdict: string
  }
  handleClose: () => any
}

export const SubmissionDetail: FunctionComponent<SubmissionDetailProps> = ({ submission, handleClose }) => {
  useContestOnly()
  const serverClock = useServerClock()

  const [sourceCodeContent, setSourceCodeContent] = useState(undefined as string | undefined)
  useEffect(() => {
    if (submission) {
      fetch(submission.sourceCode)
        .then(res => res.text())
        .then(setSourceCodeContent)
    }
  }, [submission])

  return (
    <SubmissionDetailView
      submission={submission}
      serverClock={serverClock}
      handleClose={handleClose}
      sourceCodeContent={sourceCodeContent}
    />
  )
}
