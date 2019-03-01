import React, { FunctionComponent, useEffect, useState } from 'react'
import { TopToaster } from 'ugrade/common/ActionToaster'
import { ISubmission } from '../SubmissionsView'
import { getSourceCodeFromUrl } from './actions'
import { SubmissionDetailView } from './SubmissionDetailView'

export interface SubmissionDetailProps {
  submission?: ISubmission
  handleClose: () => any
  serverClock: Date
}

export const SubmissionDetail: FunctionComponent<SubmissionDetailProps> = ({
  submission,
  handleClose,
  serverClock,
}) => {
  const [sourceCodeContent, setSourceCodeContent] = useState(undefined as
    | string
    | undefined)

  const loadSourceCode = async () => {
    if (submission && submission.sourceCode) {
      try {
        const code = await getSourceCodeFromUrl(submission.sourceCode)
        setSourceCodeContent(code)
      } catch (error) {
        TopToaster.showErrorToast(new Error('Cannot Fetch Source Code Content'))
      }
    }
  }

  useEffect(() => {
    loadSourceCode()
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

export default SubmissionDetail
