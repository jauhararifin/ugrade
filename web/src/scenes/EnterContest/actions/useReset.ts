import { push } from 'connected-react-router'
import { setSignedOut } from 'ugrade/auth/store'
import { globalErrorCatcher, useAppThunkDispatch } from 'ugrade/common'
import { unsetContest } from 'ugrade/contest/store'
import { AppThunkAction } from 'ugrade/store'

export function resetAction(): AppThunkAction {
  return async (dispatch, _getState, _extras) => {
    dispatch(push('/enter-contest'))
    dispatch(unsetContest())
    dispatch(setSignedOut())
  }
}

export function useReset() {
  const dispatch = useAppThunkDispatch()
  return () => {
    dispatch(resetAction()).catch(globalErrorCatcher)
  }
}
