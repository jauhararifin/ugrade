import React, { FunctionComponent, useEffect, useState } from 'react'
import { useContestOnly } from 'ugrade/auth'
import { globalErrorCatcher, handleCommonError } from 'ugrade/common'
import { TopToaster } from 'ugrade/common/ActionToaster'
import { useServerClock } from 'ugrade/server'
import { ISubmission } from '../SubmissionsView'
import { getSourceCodeFromUrl } from './actions'
import { SubmissionDetailView } from './SubmissionDetailView'

export interface SubmissionDetailProps {
  submission?: ISubmission
  handleClose: () => any
}

export const SubmissionDetail: FunctionComponent<SubmissionDetailProps> = ({
  submission,
  handleClose,
}) => {
  useContestOnly()
  const serverClock = useServerClock(60 * 1000)
  const [sourceCodeContent, setSourceCodeContent] = useState(undefined as
    | string
    | undefined)

  const loadSourceCode = async () => {
    if (submission && submission.sourceCode) {
      try {
        const code = await getSourceCodeFromUrl(submission.sourceCode)
        setSourceCodeContent(code)
      } catch (error) {
        if (!handleCommonError(error)) {
          TopToaster.showErrorToast(
            new Error('Cannot Fetch Source Code Content')
          )
        }
      }
    }
  }

  useEffect(() => {
    loadSourceCode().catch(globalErrorCatcher)
  }, [submission, sourceCodeContent])

  return (
    <SubmissionDetailView
      submission={submission}
      serverClock={serverClock}
      handleClose={handleClose}
      sourceCodeContent={sourceCodeContent}
    />
  )
}
