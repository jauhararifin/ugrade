export const AUTH_IS_SIGNED_IN_KEY = 'auth.isSignedIn'
export const AUTH_TOKEN_KEY = 'auth.token'

export interface User {
  contestId: string
  username: string
  name: string
  email: string
}

export interface AuthState {
  isSignedIn: boolean
  token: string
  me?: User
}

export const initialState: AuthState = {
  isSignedIn:
    (sessionStorage.getItem(AUTH_IS_SIGNED_IN_KEY) ||
      localStorage.getItem(AUTH_IS_SIGNED_IN_KEY)) === 'true',
  token:
    sessionStorage.getItem(AUTH_TOKEN_KEY) ||
    localStorage.getItem(AUTH_TOKEN_KEY) ||
    '',
}
