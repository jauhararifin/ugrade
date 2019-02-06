import { AppThunkAction } from "../../reducers"

export const forgotPasswordAction = (usernameOrEmail: string): AppThunkAction<void> => {
    return async (dispatch, getState, { authService }) => {
        await authService.forgotPassword(usernameOrEmail)
    }
}
