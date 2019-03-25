import { User } from 'ugrade/auth'
import { GenderType, Profile, ShirtSizeType } from 'ugrade/profile/profile'
import { ProfileService } from 'ugrade/profile/service'
import { AppFieldResolver } from './resolvers'
import { wrap } from './wrap'

export type ProfileByUserResolver = AppFieldResolver<User, any, Promise<Profile>>

export type SetMyProfileResolver = AppFieldResolver<
  any,
  { gender?: GenderType; shirtSize?: ShirtSizeType; address?: string },
  Promise<Profile>
>

export type UserProfileResolver = AppFieldResolver<any, { userId: string }, Promise<Profile>>

export interface ProfileResolvers {
  Query: {
    userProfile: UserProfileResolver
  }
  Mutation: {
    setMyProfile: SetMyProfileResolver
  }
  User: {
    profile: ProfileByUserResolver
  }
}

export const createProfileResolvers = (profileService: ProfileService): ProfileResolvers => ({
  Query: {
    userProfile: (_source, { userId }, { authToken }) => wrap(profileService.getUserProfile(authToken, userId)),
  },
  Mutation: {
    setMyProfile: (_source, { gender, shirtSize, address }, { authToken }) =>
      wrap(profileService.setMyProfile(authToken, gender, shirtSize, address)),
  },
  User: {
    profile: (source, _args, { authToken }) => wrap(profileService.getUserProfile(authToken, source.id)),
  },
})
