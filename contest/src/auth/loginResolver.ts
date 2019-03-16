import { ApolloError } from 'apollo-server-core'
import { compare } from 'bcrypt'
import { IFieldResolver } from 'graphql-tools'
import { logger } from 'ugrade/logger'
import { AuthStore, NoSuchUser } from './store'
import { genToken } from './util'

export type LoginResolver = IFieldResolver<
  any,
  any,
  { contestId: string; email: string; password: string }
>

export function loginResolver(store: AuthStore): LoginResolver {
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
