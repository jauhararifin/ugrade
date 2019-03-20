import { Reducer } from 'redux'
import { UserProfileActionType } from './UserProfileAction'
import { setUserProfileReducer, UserProfileSetUserProfile } from './UserProfileSetUserProfile'
import { initialState, UserProfileState } from './UserProfileState'

export const userProfileReducer: Reducer<UserProfileState> = (
  state: UserProfileState = initialState,
  action
): UserProfileState => {
  switch (action.type) {
    case UserProfileActionType.SetUserProfile:
      return setUserProfileReducer(state, action as UserProfileSetUserProfile)
  }
  return { ...state }
}
