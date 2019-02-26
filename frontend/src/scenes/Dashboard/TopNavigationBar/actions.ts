import { push } from 'connected-react-router'
import { AppThunkAction } from '../../../stores'
import { setSignedOut } from '../../../stores/Auth'

export const signOutAction = (): AppThunkAction => {
  return async dispatch => {
    dispatch(setSignedOut())
    dispatch(push('/enter-contest'))
  }
}
