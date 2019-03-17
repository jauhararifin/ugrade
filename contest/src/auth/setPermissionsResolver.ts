import { ApolloError } from 'apollo-server-core'
import { AppFieldResolver } from 'ugrade/resolvers'
import { AuthStore, NoSuchUser, Permission, UserModel } from './store'
import { userByTokenResolver } from './userByTokenResolver'

export type SetPermissionsResolver = AppFieldResolver<
  any,
  { userId: string; permissions: Permission[] },
  Promise<UserModel>
>

export function setPermissionsResolver(
  store: AuthStore
): SetPermissionsResolver {
  return async (source, args, context, info) => {
    const userByToken = userByTokenResolver(store)
    const user = await userByToken(source, args, context, info)

    // check user permission
    if (!user.permissions.includes(Permission.UsersPermissionsUpdate)) {
      throw new ApolloError('Forbidden Action', 'FORBIDDEN_ACTION')
    }

    // check given permission
    for (const perm of args.permissions) {
      if (!user.permissions.includes(perm)) {
        throw new ApolloError('Forbidden Action', 'FORBIDDEN_ACTION')
      }
    }

    // check is same contest
    let updateUser
    try {
      updateUser = await store.getUserById(args.userId)
      if (updateUser.contestId !== user.contestId) {
        throw new NoSuchUser('No Such User')
      }
    } catch (error) {
      if (error instanceof NoSuchUser) {
        throw new ApolloError('No Such User', 'NO_SUCH_USER')
      }
      throw error
    }

    updateUser.permissions = args.permissions
    return store.putUser(updateUser)
  }
}
