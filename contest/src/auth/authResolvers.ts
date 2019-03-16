import { compare } from 'bcrypt'
import { IFieldResolver } from 'graphql-tools'
import { AppContext } from 'ugrade'
import { INVALID_CREDENTIAL, INVALID_TOKEN, NO_SUCH_USER } from './errors'
import { AuthStore, NoSuchUser } from './store'
import { genToken } from './util'

export interface AuthResolvers {
  Mutation: {
    login: IFieldResolver<
      any,
      any,
      { contestId: string; email: string; password: string }
    >
  }
  Query: {
    user: IFieldResolver<any, AppContext, any>
    userById: IFieldResolver<any, any, { id: string }>
    userByEmail: IFieldResolver<any, any, { contestId: string; email: string }>
    userByUsername: IFieldResolver<
      any,
      any,
      { contestId: string; username: string }
    >
  }
}

export const createAuthResolvers = (store: AuthStore): AuthResolvers => ({
  Mutation: {
    login: async (_parent, { contestId, email, password }) => {
      try {
        const user = await store.getUserByEmail(contestId, email)
        const success = await compare(password, user.password)
        if (success) {
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
        throw INVALID_CREDENTIAL
      } catch (error) {
        if (error instanceof NoSuchUser) {
          throw INVALID_CREDENTIAL
        }
        throw error
      }
    },
  },

  Query: {
    user: async (_parent, _args, { authToken }) => {
      try {
        const user = await store.getUserByToken(authToken)
        return await store.getUserById(user.id)
      } catch (error) {
        if (error instanceof NoSuchUser) throw INVALID_TOKEN
        throw error
      }
    },

    userById: async (_source, { id }) => {
      try {
        return await store.getUserById(id)
      } catch (error) {
        if (error instanceof NoSuchUser) throw NO_SUCH_USER
        throw error
      }
    },

    userByEmail: async (_source, { contestId, email }) => {
      try {
        return await store.getUserByEmail(contestId, email)
      } catch (error) {
        if (error instanceof NoSuchUser) throw NO_SUCH_USER
        throw error
      }
    },

    userByUsername: async (_source, { contestId, username }) => {
      try {
        return await store.getUserByUsername(contestId, username)
      } catch (error) {
        if (error instanceof NoSuchUser) throw NO_SUCH_USER
        throw error
      }
    },
  },
})
