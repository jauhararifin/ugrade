import { UserProfileActionType } from './UserProfileAction'
import { GenderType, ShirtSizeType, UserProfileState } from './UserProfileState'

export interface UserProfileSetUserProfile {
  type: UserProfileActionType.SetUserProfile
  gender?: GenderType
  shirtSize?: ShirtSizeType
  address?: string
}

export const setUserProfile = (
  gender?: GenderType,
  shirtSize?: ShirtSizeType,
  address?: string
): UserProfileSetUserProfile => ({
  type: UserProfileActionType.SetUserProfile,
  gender,
  shirtSize,
  address,
})

export function setUserProfileReducer(
  state: UserProfileState,
  action: UserProfileSetUserProfile
): UserProfileState {
  const nextState = {
    ...state,
    gender: action.gender,
    shirtSize: action.shirtSize,
    address: action.address,
  }
  return nextState
}
