import { AppThunkAction } from "../../../stores"
import ActionToaster from "../../../middlewares/ErrorToaster/ActionToaster"

export const setPassword = (oldPassword: string, newPassword: string): AppThunkAction => {
    return async (dispatch, getState, { authService }) => {
        const token = getState().auth.token
        await authService.setMyPassword(token, oldPassword, newPassword)
        ActionToaster.showSuccessToast("Password Changed")
    }
}
