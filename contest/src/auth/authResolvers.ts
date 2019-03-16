import { compare } from 'bcrypt'
import { IFieldResolver } from 'graphql-tools'
import { ContestStore } from '../contest/store'
import { AppContext } from '../context'
import { NoSuchUser, UserStore } from '../user/store'
import { INVALID_CREDENTIAL, INVALID_TOKEN } from './errors'
import { AuthStore, NoSuchCredential } from './store'
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
    contest: IFieldResolver<any, AppContext, any>
  }
}

export const createAuthResolvers = (
  userStore: UserStore,
  authStore: AuthStore,
  contestStore: ContestStore
): AuthResolvers => ({
  Mutation: {
    login: async (_parent, { contestId, email, password }) => {
      try {
        const user = await userStore.getUserByEmail(contestId, email)
        const cred = await authStore.getCredentialByUserId(user.id)
        const success = await compare(password, cred.password)
        if (success) {
          if (cred.token && cred.token.length > 0) {
            return cred.token
          }
          const newCred = {
            userId: cred.userId,
            password: cred.password,
            token: genToken(),
          }
          const result = await authStore.putUserCredential(newCred)
          return result.token
        }
        throw INVALID_CREDENTIAL
      } catch (error) {
        if (error instanceof NoSuchCredential || error instanceof NoSuchUser) {
          throw INVALID_CREDENTIAL
        }
        throw error
      }
    },
  },

  Query: {
    user: async (_parent, _args, { authToken }) => {
      try {
        const cred = await authStore.getCredentialByToken(authToken)
        return await userStore.getUserById(cred.userId)
      } catch (error) {
        if (error instanceof NoSuchUser || error instanceof NoSuchCredential) {
          throw INVALID_TOKEN
        }
        throw error
      }
    },

    contest: async (_parent, _args, { authToken }) => {
      try {
        const cred = await authStore.getCredentialByToken(authToken)
        return await contestStore.getContestById(cred.userId)
      } catch (error) {
        if (error instanceof NoSuchUser || error instanceof NoSuchCredential) {
          throw INVALID_TOKEN
        }
        throw error
      }
    },
  },
})
