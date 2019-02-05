import { AppThunkAction } from "../../reducers";
import { UserRegistrationError } from "../../services/auth";

export interface SignUpResult {
    success: boolean
    message?: string
}

export const signUpAction = (username: string, name: string, email: string, password: string): AppThunkAction<SignUpResult> => {
    return async (dispatch, getState, { authService }) => {
        try {
            await authService.register(username, name, email, password)
            return { success: true }
        } catch (error) {
            if (error instanceof UserRegistrationError)
                return { success: false, message: error.message }
            throw error
        }
    }
}