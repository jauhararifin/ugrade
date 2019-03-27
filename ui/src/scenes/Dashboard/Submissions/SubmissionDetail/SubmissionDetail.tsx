import { useObserver } from 'mobx-react-lite'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { useServer } from '../../../../app'
import { useContestOnly } from '../../../../common'
import { ISubmission } from '../SubmissionsView'
import { SubmissionDetailView } from './SubmissionDetailView'

export interface SubmissionDetailProps {
  submission?: ISubmission
  handleClose: () => any
}

export const SubmissionDetail: FunctionComponent<SubmissionDetailProps> = ({ submission, handleClose }) => {
  useContestOnly()
  const serverStore = useServer()

  return useObserver(() => {
    const serverClock = serverStore.serverClock
    return (
      <SubmissionDetailView
        submission={submission}
        serverClock={serverClock}
        handleClose={handleClose}
        sourceCodeContent={'some source code content that i stubbed'}
      />
    )
  })
}
