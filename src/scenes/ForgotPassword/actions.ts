import { AppThunkAction } from "../../stores"
import ActionToaster from "../../middlewares/ErrorToaster/ActionToaster"

export const forgotPasswordAction = (usernameOrEmail: string): AppThunkAction<void> => {
    return async (dispatch, getState, { authService }) => {
        await authService.forgotPassword(usernameOrEmail)
        ActionToaster.showSuccessToast('Check Your Email')
    }
}
