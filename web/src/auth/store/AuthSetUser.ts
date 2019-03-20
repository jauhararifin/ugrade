import { AuthActionType } from './AuthAction'
import { AuthState, User } from './AuthState'

export interface AuthSetUser {
  type: AuthActionType.SetUser
  users: { [userId: string]: User }
}

export const setUsers = (users: { [userId: string]: User }): AuthSetUser => ({
  type: AuthActionType.SetUser,
  users,
})

export function setUserReducer(state: AuthState, action: AuthSetUser): AuthState {
  return {
    ...state,
    users: {
      ...state.users,
      ...action.users,
    },
  }
}
