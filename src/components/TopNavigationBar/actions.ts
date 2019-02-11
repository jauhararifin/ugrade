import ActionToaster from '../../middlewares/ErrorToaster/ActionToaster'
import { AuthenticationError } from '../../services/auth'
import { AppThunkAction } from '../../stores'
import { setMe, setSignedOut, User } from '../../stores/Auth'

export const getMeAction = (): AppThunkAction<User> => {
  return async (dispatch, getState, { authService }) => {
    try {
      const token = getState().auth.token
      const me = await authService.getMyProfile(token)
      dispatch(setMe(me))
      return me
    } catch (error) {
      if (error instanceof AuthenticationError) dispatch(setSignedOut())
      throw error
    }
  }
}

export const setMeSignOut = (): AppThunkAction => {
  return async dispatch => {
    dispatch(setSignedOut())
    ActionToaster.showSuccessToast('You are signed out')
  }
}
