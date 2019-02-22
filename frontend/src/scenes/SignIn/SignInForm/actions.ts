import ActionToaster from '../../../middlewares/ErrorToaster/ActionToaster'
import { AuthenticationError } from '../../../services/auth'
import { AppThunkAction } from '../../../stores'
import { setMe, setSignedIn } from '../../../stores/Auth'

export interface SignInResult {
  success: boolean
  message?: string
}

export const signInAction = (
  username: string,
  password: string,
  rememberMe: boolean
): AppThunkAction<SignInResult> => {
  return async (dispatch, _, { authService }) => {
    try {
      const token = await authService.login(username, password)
      const me = await authService.getMyProfile(token)
      dispatch(setSignedIn(token, rememberMe))
      dispatch(setMe(me))
      ActionToaster.showSuccessToast('You Are Signed In')
      return { success: true }
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return { success: false, message: error.message }
      }
      throw error
    }
  }
}
