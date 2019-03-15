import { push } from 'connected-react-router'
import { setSignedOut } from 'ugrade/auth/store'
import { globalErrorCatcher, useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/store'

export function resetAccountAction(): AppThunkAction {
  return async (dispatch, _getState, _extras) => {
    dispatch(push('/enter-contest/enter-email'))
    dispatch(setSignedOut())
  }
}

export function useResetAccount() {
  const dispatch = useAppThunkDispatch()
  return () => {
    dispatch(resetAccountAction()).catch(globalErrorCatcher)
  }
}
