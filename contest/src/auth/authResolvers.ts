import { loginResolver, LoginResolver } from './loginResolver'
import { AuthStore } from './store'
import { userByEmailResolver, UserByEmailResolver } from './userByEmailResolver'
import { userByIdResolver, UserByIdResolver } from './userByIdResolver'
import { userByTokenResolver, UserByTokenResolver } from './userByTokenResolver'
import {
  userByUsernameResolver,
  UserByUsernameResolver,
} from './userByUsername'

export interface AuthResolvers {
  Mutation: {
    login: LoginResolver
  }
  Query: {
    user: UserByTokenResolver
    userById: UserByIdResolver
    userByEmail: UserByEmailResolver
    userByUsername: UserByUsernameResolver
  }
}

export const createAuthResolvers = (store: AuthStore): AuthResolvers => ({
  Mutation: {
    login: loginResolver(store),
  },
  Query: {
    user: userByTokenResolver(store),
    userById: userByIdResolver(store),
    userByEmail: userByEmailResolver(store),
    userByUsername: userByUsernameResolver(store),
  },
})
