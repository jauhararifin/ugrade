import { Reducer } from "redux"
import { AuthState, initialState, AUTH_TOKEN_KEY, AUTH_IS_SIGNED_IN_KEY, AUTH_REMEMBER_ME_KEY } from "./AuthState"
import { AuthActionType } from "./AuthAction"

export const authReducer: Reducer<AuthState> = (state: AuthState = initialState, action): AuthState => {
    let result = { ...state }

    switch (action.type) {
        case AuthActionType.SetSignedIn:
            result.isSignedIn = true
            result.token = action.token
            result.rememberMe = action.rememberMe
            break

        case AuthActionType.SetMe:
            result.me = action.me
            break

        case AuthActionType.SetSignedOut:
            result.isSignedIn = false
            result.token = ''
            result.rememberMe = false
            result.me = undefined
    }

    sessionStorage.setItem(AUTH_TOKEN_KEY, result.token)
    sessionStorage.setItem(AUTH_IS_SIGNED_IN_KEY, result.isSignedIn ? 'true' : 'false')
    sessionStorage.setItem(AUTH_REMEMBER_ME_KEY, result.rememberMe ? 'true' : 'false')

    if (result.rememberMe) {
        localStorage.setItem(AUTH_TOKEN_KEY, result.token)
        localStorage.setItem(AUTH_IS_SIGNED_IN_KEY, result.isSignedIn ? 'true' : 'false')
        localStorage.setItem(AUTH_REMEMBER_ME_KEY, result.rememberMe ? 'true' : 'false')
    }

    return result
}