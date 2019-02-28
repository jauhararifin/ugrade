import { createSelector } from 'reselect'

import { AppState } from '../state'
import { AuthState } from './AuthState'

function getAuth(state: AppState): AuthState {
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
