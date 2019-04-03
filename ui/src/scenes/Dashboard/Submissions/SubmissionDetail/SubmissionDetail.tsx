import { useContestOnly } from '@/auth'
import { useServerClock } from '@/window'
import React, { FunctionComponent } from 'react'
import { SubmissionDetailView } from './SubmissionDetailView'

export interface SubmissionDetailProps {
  submission?: {
    id: string
    issuedTime: Date
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

  return (
    <SubmissionDetailView
      submission={submission}
      serverClock={serverClock}
      handleClose={handleClose}
      sourceCodeContent={'some source code content that i stubbed'}
    />
  )
}
