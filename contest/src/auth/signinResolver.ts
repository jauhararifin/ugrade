import { ApolloError } from 'apollo-server-core'
import { compare } from 'bcrypt'
import { logger } from 'ugrade/logger'
import { AppFieldResolver } from 'ugrade/resolvers'
import { AuthStore, NoSuchUser } from './store'
import { genToken } from './util'

export type SigninResolver = AppFieldResolver<
  any,
  { contestId: string; email: string; password: string },
  Promise<string>
>

export function signinResolver(store: AuthStore): SigninResolver {
  return async (_parent, { contestId, email, password }) => {
    try {
      const user = await store.getUserByEmail(contestId, email)
      const success = await compare(password, user.password)
      if (success) {
        logger.info('User %s/%s logged in', contestId, user.id)
        if (user.token && user.token.length > 0) {
          return user.token
        }
        const newUser = {
          ...user,
          token: genToken(),
        }
        const result = await store.putUser(newUser)
        return result.token
      }
      throw new ApolloError('Invalid Credential', 'INVALID_CREDENTIAL')
    } catch (error) {
      logger.error('User login failed contestId:%s email:%s', contestId, email)
      if (error instanceof NoSuchUser) {
        throw new ApolloError('Invalid Credential', 'INVALID_CREDENTIAL')
      }
      throw error
    }
  }
}
