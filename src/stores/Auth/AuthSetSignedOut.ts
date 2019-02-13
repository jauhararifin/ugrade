import { AuthActionType } from './AuthAction'
import {
  AUTH_IS_SIGNED_IN_KEY,
  AUTH_REMEMBER_ME_KEY,
  AUTH_TOKEN_KEY,
  AuthState,
} from './AuthState'

export interface AuthSetSignedOut {
  type: AuthActionType.SetSignedOut
}

export const setSignedOut = (): AuthSetSignedOut => ({
  type: AuthActionType.SetSignedOut,
})

export function setSignedOutReducer(
  state: AuthState,
  _action: AuthSetSignedOut
): AuthState {
  const nextState = {
    ...state,
    isSignedIn: false,
    token: '',
    rememberMe: false,
    me: undefined,
  }

  sessionStorage.removeItem(AUTH_IS_SIGNED_IN_KEY)
  sessionStorage.removeItem(AUTH_TOKEN_KEY)
  sessionStorage.removeItem(AUTH_REMEMBER_ME_KEY)
  localStorage.removeItem(AUTH_IS_SIGNED_IN_KEY)
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_REMEMBER_ME_KEY)

  return nextState
}
