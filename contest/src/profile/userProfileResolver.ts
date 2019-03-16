import { ApolloError } from 'apollo-server-core'
import { IFieldResolver } from 'graphql-tools'
import { userByTokenResolver } from 'ugrade/auth'
import { AuthStore, NoSuchUser, Permission } from 'ugrade/auth/store'
import { AppContext } from 'ugrade/context'
import { NoSuchProfile, ProfileStore } from './store'

export type UserProfileResolver = IFieldResolver<
  any,
  AppContext,
  { userId: string }
>

export function userProfileResolver(
  profileStore: ProfileStore,
  authStore: AuthStore
): UserProfileResolver {
  return async (source, args, context, info) => {
    const userByToken = userByTokenResolver(authStore)
    try {
      const me = await userByToken(source, args, context, info)
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
      if (error instanceof NoSuchProfile) return {}
      throw error
    }
  }
}
