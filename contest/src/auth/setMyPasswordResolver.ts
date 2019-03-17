import { ApolloError } from 'apollo-server-core'
import { compare, hash } from 'bcrypt'
import { AppFieldResolver } from 'ugrade/resolvers'
import { AuthStore, UserModel } from './store'
import { userByTokenResolver } from './userByTokenResolver'

export type SetMyPasswordResolver = AppFieldResolver<
  any,
  { oldPassword: string; newPassword: string },
  Promise<UserModel>
>

export function setMyPasswordResolver(store: AuthStore): SetMyPasswordResolver {
  return async (source, args, context, info) => {
    const userByToken = userByTokenResolver(store)
    const user = await userByToken(source, args, context, info)

    const success = await compare(args.oldPassword, user.password)
    if (!success) {
      throw new ApolloError('Wrong Password', 'WRONG_PASSWORD')
    }

    user.password = await hash(args.newPassword, 10)
    return store.putUser(user)
  }
}
