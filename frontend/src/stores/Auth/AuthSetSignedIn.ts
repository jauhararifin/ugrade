import { AuthActionType } from './AuthAction'
import { AUTH_IS_SIGNED_IN_KEY, AUTH_TOKEN_KEY, AuthState } from './AuthState'

export interface AuthSetSignedIn {
  type: AuthActionType.SetSignedIn
  token: string
  rememberMe: boolean
}

export const setSignedIn = (
  token: string,
  rememberMe: boolean = false
): AuthSetSignedIn => ({
  type: AuthActionType.SetSignedIn,
  token,
  rememberMe,
})

export function setSignedInReducer(
  state: AuthState,
  action: AuthSetSignedIn
): AuthState {
  const nextState = {
    ...state,
    isSignedIn: true,
    token: action.token,
  }

  sessionStorage.setItem(AUTH_TOKEN_KEY, nextState.token)
  sessionStorage.setItem(AUTH_IS_SIGNED_IN_KEY, 'true')

  if (action.rememberMe) {
    localStorage.setItem(AUTH_TOKEN_KEY, nextState.token)
    localStorage.setItem(
      AUTH_IS_SIGNED_IN_KEY,
      nextState.isSignedIn ? 'true' : 'false'
    )
  }

  return nextState
}
