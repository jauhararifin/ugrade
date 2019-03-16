import { AuthStore } from 'ugrade/auth/store'
import {
  ProfileByTokenResolver,
  profileByTokenResolver,
} from './profileByTokenResolver'
import {
  profileByUserResolver,
  ProfileByUserResolver,
} from './profileByUserResolver'
import {
  SetMyProfileResolver,
  setMyProfileResolver,
} from './setMyProfileResolver'
import { ProfileStore } from './store'
import { UserProfileResolver, userProfileResolver } from './userProfileResolver'

export interface ProfileResolvers {
  Query: {
    profile: ProfileByTokenResolver
    userProfile: UserProfileResolver
  }
  Mutation: {
    setMyProfile: SetMyProfileResolver
  }
  User: {
    profile: ProfileByUserResolver
  }
}

export const createProfileResolvers = (
  profileStore: ProfileStore,
  authStore: AuthStore
): ProfileResolvers => ({
  Query: {
    profile: profileByTokenResolver(profileStore, authStore),
    userProfile: userProfileResolver(profileStore, authStore),
  },
  Mutation: {
    setMyProfile: setMyProfileResolver(profileStore, authStore),
  },
  User: {
    profile: profileByUserResolver(profileStore, authStore),
  },
})
