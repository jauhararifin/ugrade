import { push } from 'connected-react-router'
import { AppThunkAction } from '../../stores'
import { setSignedOut } from '../../stores/Auth'
import { unsetContest } from '../../stores/Contest'

export function resetAction(): AppThunkAction {
  return async (dispatch, _getState, _extras) => {
    dispatch(push('/enter-contest'))
    dispatch(unsetContest())
    dispatch(setSignedOut())
  }
}
