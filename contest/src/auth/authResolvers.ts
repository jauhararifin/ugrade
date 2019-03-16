import { IFieldResolver } from 'graphql-tools'
import { AuthStore } from './store'
import { UserStore } from '../user/store'
import { compare } from 'bcrypt'
import { InvalidCredential } from './InvalidCredential'
import { AppContext } from '../context'
import { ContestStore } from '../contest/store'

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

function genToken() {
  let text = ''
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < 128; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  return text
}

export const createAuthResolvers = (
  userStore: UserStore,
  authStore: AuthStore,
  contestStore: ContestStore
): AuthResolvers => ({
  Mutation: {
    login: async (_parent, { contestId, email, password }) => {
      const user = await userStore.getUserByEmail(contestId, email)
      const cred = await authStore.getCredentialByUserId(user.id)
      if (await compare(password, cred.password)) {
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
      throw new InvalidCredential('Invalid Credential')
    },
  },

  Query: {
    user: async (_parent, _args, { authToken }) =>
      userStore.getUserById(
        (await authStore.getCredentialByToken(authToken)).userId
      ),
    contest: async (_parent, _args, { authToken }) =>
      contestStore.getContestById(
        (await authStore.getCredentialByToken(authToken)).userId
      ),
  },
})
