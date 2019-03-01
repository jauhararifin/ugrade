import { AuthError } from 'ugrade/services/auth'
import { ContestError } from 'ugrade/services/contest/errors'
import { NetworkError } from 'ugrade/services/serverStatus'
import { TopToaster } from './ActionToaster'

export function handleCommonError(error: Error) {
  if (error instanceof AuthError) {
    TopToaster.showErrorToast(error)
    return true
  } else if (error instanceof ContestError) {
    TopToaster.showErrorToast(error)
    return true
  } else if (error instanceof NetworkError) {
    TopToaster.showErrorToast(new Error('You Are Currently Offline'))
    return true
  }
  return false
}
