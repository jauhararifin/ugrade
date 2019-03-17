import { userByTokenResolver } from 'ugrade/auth'
import { AuthStore } from 'ugrade/auth/store'
import { AppFieldResolver } from 'ugrade/resolvers'
import { NoSuchProfile, ProfileModel, ProfileStore } from './store'

export type ProfileByTokenResolver = AppFieldResolver<
  any,
  any,
  Promise<ProfileModel>
>

export function profileByTokenResolver(
  profileStore: ProfileStore,
  authStore: AuthStore
): ProfileByTokenResolver {
  return async (source, args, context, info) => {
    const userByToken = userByTokenResolver(authStore)
    const user = await userByToken(source, args, context, info)
    try {
      return await profileStore.getProfile(user.id)
    } catch (error) {
      if (error instanceof NoSuchProfile) return { userId: user.id }
      throw error
    }
  }
}
