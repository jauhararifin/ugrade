import { IFieldResolver } from 'graphql-tools'
import { userByTokenResolver } from 'ugrade/auth'
import { AuthStore } from 'ugrade/auth/store'
import { AppContext } from 'ugrade/context'
import { logger } from 'ugrade/logger'
import { GenderType, ProfileStore, ShirtSizeType } from './store'

export type SetMyProfileResolver = IFieldResolver<
  any,
  AppContext,
  { gender?: GenderType; shirtSize?: ShirtSizeType; address?: string }
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
