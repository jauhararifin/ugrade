import { push } from 'connected-react-router'
import { AppThunkAction } from '../../../stores'
import { setMe, setSignedOut, User } from '../../../stores/Auth'

export const getMeAction = (): AppThunkAction<User> => {
  return async (dispatch, getState, { authService }) => {
    const token = getState().auth.token
    const me = await authService.getMe(token)
    dispatch(setMe(me))
    return me
  }
}

export const signOutAction = (): AppThunkAction => {
  return async dispatch => {
    dispatch(setSignedOut())
    dispatch(push('/enter-contest'))
  }
}
