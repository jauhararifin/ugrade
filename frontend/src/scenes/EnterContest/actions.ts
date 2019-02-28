import { push } from 'connected-react-router'

import { useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/stores'
import { setSignedOut } from 'ugrade/stores/Auth'
import { unsetContest } from 'ugrade/stores/Contest'

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
    dispatch(resetAction()).catch(() => null)
  }
}

export function resetAccountAction(): AppThunkAction {
  return async (dispatch, _getState, _extras) => {
    dispatch(push('/enter-contest/enter-email'))
    dispatch(setSignedOut())
  }
}

export function useResetAccount() {
  const dispatch = useAppThunkDispatch()
  return () => {
    dispatch(resetAccountAction()).catch(() => null)
  }
}
