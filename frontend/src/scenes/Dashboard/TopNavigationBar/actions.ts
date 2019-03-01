import { push } from 'connected-react-router'
import { AppThunkAction } from 'ugrade/store'
import { setSignedOut } from 'ugrade/stores/Auth'

export const signOutAction = (): AppThunkAction => {
  return async dispatch => {
    dispatch(setSignedOut())
    dispatch(push('/enter-contest'))
  }
}
