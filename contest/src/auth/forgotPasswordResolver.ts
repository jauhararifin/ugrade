import { AppFieldResolver } from 'ugrade/resolvers'
import { AuthStore, UserModel } from './store'
import { userByEmailResolver } from './userByEmailResolver'
import { genOTC } from './util'

export type ForgotPasswordResolver = AppFieldResolver<
  any,
  { contestId: string; email: string },
  Promise<UserModel>
>

export function forgotPasswordResolver(
  store: AuthStore
): ForgotPasswordResolver {
  return async (source, args, context, info) => {
    const userByEmail = userByEmailResolver(store)
    const user = await userByEmail(source, args, context, info)
    if (!user.resetPasswordCode) {
      user.resetPasswordCode = genOTC()
      return store.putUser(user)
    }
    return user
  }
}
