import { push } from 'connected-react-router'
import ActionToaster from '../../middlewares/ErrorToaster/ActionToaster'
import { UserRegistrationError } from '../../services/auth'
import { AppThunkAction } from '../../stores'

export interface SignUpResult {
  success: boolean
  message?: string
}

export const signUpAction = (
  username: string,
  name: string,
  email: string,
  password: string
): AppThunkAction<SignUpResult> => {
  return async (dispatch, getState, { authService }) => {
    try {
      await authService.register(username, name, email, password)
      dispatch(push('/signin'))
      ActionToaster.showSuccessToast('Your Account Successfully Created')
      return { success: true }
    } catch (error) {
      if (error instanceof UserRegistrationError) {
        return { success: false, message: error.message }
      }
      throw error
    }
  }
}
