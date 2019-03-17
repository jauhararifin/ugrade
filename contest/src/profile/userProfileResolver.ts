import { ApolloError } from 'apollo-server-core'
import { userByTokenResolver } from 'ugrade/auth'
import { AuthStore, NoSuchUser, Permission } from 'ugrade/auth/store'
import { AppFieldResolver } from 'ugrade/resolvers'
import { NoSuchProfile, ProfileModel, ProfileStore } from './store'

export type UserProfileResolver = AppFieldResolver<
  any,
  { userId: string },
  Promise<ProfileModel>
>

export function userProfileResolver(
  profileStore: ProfileStore,
  authStore: AuthStore
): UserProfileResolver {
  return async (source, args, context, info) => {
    const userByToken = userByTokenResolver(authStore)
    const me = await userByToken(source, args, context, info)
    try {
      const allowed = me.permissions.includes(Permission.ProfilesRead)
      if (!allowed) {
        throw new ApolloError('Forbidden Action', 'FORBIDDEN_ACTION')
      }

      const [profile, user] = await Promise.all([
        profileStore.getProfile(args.userId),
        authStore.getUserById(args.userId),
      ])
      if (user.contestId !== me.contestId) {
        throw new ApolloError('No Such User', 'NO_SUCH_USER')
      }

      return profile
    } catch (error) {
      if (error instanceof NoSuchUser) {
        throw new ApolloError('No Such User', 'NO_SUCH_USER')
      }
      if (error instanceof NoSuchProfile) return { userId: me.id }
      throw error
    }
  }
}
