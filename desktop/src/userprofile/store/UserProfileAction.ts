import { UserProfileSetUserProfile } from './UserProfileSetUserProfile'

export enum UserProfileActionType {
  SetUserProfile = 'USER_PROFILE_ACTION_SET_USER_PROFILE',
}

export type UserProfileAction = UserProfileSetUserProfile
