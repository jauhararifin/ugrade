import { ApolloError } from 'apollo-server-core'
import { IFieldResolver } from 'graphql-tools'
import { userByTokenResolver } from 'ugrade/auth'
import { AuthStore, Permission, UserModel } from 'ugrade/auth/store'
import { NoSuchProfile, ProfileStore } from './store'

export type ProfileByUserResolver = IFieldResolver<UserModel, any, any>

export function profileByUserResolver(
  profileStore: ProfileStore,
  authStore: AuthStore
): ProfileByUserResolver {
  return async (source, args, context, info) => {
    const userByToken = userByTokenResolver(authStore)
    try {
      const me = await userByToken(source, args, context, info)
      const allowed =
        me.id === source.id || me.permissions.includes(Permission.ProfilesRead)
      if (!allowed) {
        throw new ApolloError('Forbidden Action', 'FORBIDDEN_ACTION')
      }

      const profile = await profileStore.getProfile(source.id)
      if (source.contestId !== me.contestId) {
        throw new ApolloError('No Such User', 'NO_SUCH_USER')
      }
      return profile
    } catch (error) {
      if (error instanceof NoSuchProfile) return {}
      throw error
    }
  }
}
