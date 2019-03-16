import { IFieldResolver } from 'graphql-tools'
import { userByTokenResolver } from 'ugrade/auth'
import { AuthStore } from 'ugrade/auth/store'
import { AppContext } from 'ugrade/context'
import { NoSuchProfile, ProfileStore } from './store'

export type ProfileByTokenResolver = IFieldResolver<any, AppContext, any>

export function profileByTokenResolver(
  profileStore: ProfileStore,
  authStore: AuthStore
): ProfileByTokenResolver {
  return async (source, args, context, info) => {
    const userByToken = userByTokenResolver(authStore)
    try {
      const user = await userByToken(source, args, context, info)
      return await profileStore.getProfile(user.id)
    } catch (error) {
      if (error instanceof NoSuchProfile) return {}
      throw error
    }
  }
}
