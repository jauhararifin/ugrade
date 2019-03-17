import { userByTokenResolver } from 'ugrade/auth'
import { AuthStore } from 'ugrade/auth/store'
import { logger } from 'ugrade/logger'
import { AppFieldResolver } from 'ugrade/resolvers'
import { GenderType, ProfileModel, ProfileStore, ShirtSizeType } from './store'

export type SetMyProfileResolver = AppFieldResolver<
  any,
  { gender?: GenderType; shirtSize?: ShirtSizeType; address?: string },
  Promise<ProfileModel>
>

export function setMyProfileResolver(
  profileStore: ProfileStore,
  authStore: AuthStore
): SetMyProfileResolver {
  return async (source, args, context, info) => {
    const userByToken = userByTokenResolver(authStore)
    const me = await userByToken(source, args, context, info)

    logger.info('User %s/%s set profile', me.contestId, me.id, args)
    return profileStore.putProfile({
      userId: me.id,
      ...args,
    })
  }
}
