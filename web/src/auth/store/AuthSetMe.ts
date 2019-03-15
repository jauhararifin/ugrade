import { AuthActionType } from './AuthAction'
import { AuthState, User } from './AuthState'

export interface AuthSetMe {
  type: AuthActionType.SetMe
  me: User
}

export const setMe = (me: User): AuthSetMe => ({
  type: AuthActionType.SetMe,
  me,
})

export function setMeReducer(state: AuthState, action: AuthSetMe): AuthState {
  const nextState = {
    ...state,
    me: action.me,
  }

  return nextState
}
