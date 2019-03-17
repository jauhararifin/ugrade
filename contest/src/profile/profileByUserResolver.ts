import { ApolloError } from 'apollo-server-core'
import { userByTokenResolver } from 'ugrade/auth'
import { AuthStore, Permission, UserModel } from 'ugrade/auth/store'
import { AppFieldResolver } from 'ugrade/resolvers'
import { NoSuchProfile, ProfileModel, ProfileStore } from './store'

export type ProfileByUserResolver = AppFieldResolver<
  UserModel,
  any,
  Promise<ProfileModel>
>

export function profileByUserResolver(
  profileStore: ProfileStore,
  authStore: AuthStore
): ProfileByUserResolver {
  return async (source, args, context, info) => {
    const userByToken = userByTokenResolver(authStore)
    const me = await userByToken(source, args, context, info)
    try {
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
      if (error instanceof NoSuchProfile) return { userId: me.id }
      throw error
    }
  }
}
