import ActionToaster from '../../../middlewares/ErrorToaster/ActionToaster'
import { AppThunkAction } from '../../../stores'

export const forgotPasswordAction = (
  usernameOrEmail: string
): AppThunkAction<void> => {
  return async (_dispatch, _getState, { authService }) => {
    await authService.forgotPassword(usernameOrEmail)
    ActionToaster.showSuccessToast('Check Your Email')
  }
}
