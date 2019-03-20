import { AuthActionType } from './AuthAction'
import { AUTH_IS_SIGNED_IN_KEY, AUTH_TOKEN_KEY, AuthState } from './AuthState'

export interface AuthSetSignedOut {
  type: AuthActionType.SetSignedOut
}

export const setSignedOut = (): AuthSetSignedOut => ({
  type: AuthActionType.SetSignedOut,
})

export function setSignedOutReducer(_state: AuthState, _action: AuthSetSignedOut): AuthState {
  sessionStorage.removeItem(AUTH_IS_SIGNED_IN_KEY)
  sessionStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_IS_SIGNED_IN_KEY)
  localStorage.removeItem(AUTH_TOKEN_KEY)

  return {
    isSignedIn: false,
    token: '',
    me: undefined,
    users: {},
  }
}
