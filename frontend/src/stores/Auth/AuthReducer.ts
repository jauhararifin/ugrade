import { Reducer } from 'redux'

import { AuthActionType } from './AuthAction'
import { AuthSetMe, setMeReducer } from './AuthSetMe'
import { AuthSetSignedIn, setSignedInReducer } from './AuthSetSignedIn'
import { AuthSetSignedOut, setSignedOutReducer } from './AuthSetSignedOut'
import { AuthState, initialState } from './AuthState'

export const authReducer: Reducer<AuthState> = (
  state: AuthState = initialState,
  action
): AuthState => {
  switch (action.type) {
    case AuthActionType.SetSignedIn:
      return setSignedInReducer(state, action as AuthSetSignedIn)

    case AuthActionType.SetMe:
      return setMeReducer(state, action as AuthSetMe)

    case AuthActionType.SetSignedOut:
      return setSignedOutReducer(state, action as AuthSetSignedOut)
  }
  return { ...state }
}
