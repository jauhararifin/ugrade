import { AppThunkAction } from "../../reducers"
import { setTitle } from "../../reducers/Title"
import { AuthenticationError } from "../../services/auth"

export interface SignInResult {
    success: boolean
    message?: string
}

export const signInAction = (username: string, password: string): AppThunkAction<SignInResult> => {
    return async (dispatch, getState, { authService }) => {
        try {
            const token = await authService.login(username, password)
            await dispatch(setTitle(token))
            return { success: true }
        } catch (error) {
            if (error instanceof AuthenticationError)
                return { success: false, message: error.message }
            throw error
        }
    }
}
