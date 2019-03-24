import { AnnouncementError } from 'ugrade/services/announcement/errors'
import { AuthError } from 'ugrade/services/auth'
import { ClarificationError } from 'ugrade/services/clarification/errors'
import { ContestError } from 'ugrade/services/contest/errors'
import { ProblemError } from 'ugrade/services/problem'
import { NetworkError } from 'ugrade/services/serverStatus'
import { SubmissionError } from 'ugrade/services/submission/errors'
import { TopToaster } from './ActionToaster'

export function handleCommonError(error: Error) {
  const justToastErrors = [
    AuthError,
    ContestError,
    ProblemError,
    SubmissionError,
    AnnouncementError,
    ClarificationError,
  ]
  for (const justToastError of justToastErrors) {
    if (error instanceof justToastError) {
      TopToaster.showErrorToast(error)
      return true
    }
  }

  if (error instanceof NetworkError) {
    TopToaster.showErrorToast(new Error('You Are Currently Offline'))
    return true
  }
  TopToaster.showErrorToast(new Error('Internal Server Error'))
  return false
}
