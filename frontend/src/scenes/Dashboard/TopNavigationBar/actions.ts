import { push } from 'connected-react-router'
import { setSignedOut } from 'ugrade/auth/store'
import { AppThunkAction } from 'ugrade/store'

export const signOutAction = (): AppThunkAction => {
  return async dispatch => {
    dispatch(setSignedOut())
    dispatch(push('/enter-contest'))
  }
}
