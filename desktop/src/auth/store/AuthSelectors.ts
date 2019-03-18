import { createSelector } from 'reselect'

import { AppState } from 'ugrade/store'
import { AuthState } from './AuthState'

export function getAuth(state: AppState): AuthState {
  return state.auth
}

export const getMe = createSelector(
  getAuth,
  auth => auth.me
)

export const getToken = createSelector(
  getAuth,
  auth => auth.token
)

export const getIsSignedIn = createSelector(
  getAuth,
  auth => auth.isSignedIn && auth.token.length > 0
)
