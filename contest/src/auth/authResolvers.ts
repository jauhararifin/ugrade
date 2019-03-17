import { SigninResolver, signinResolver } from './signinResolver'
import { SignupResolver, signupResolver } from './signupResolver'
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
    signin: SigninResolver
    signup: SignupResolver
    // forgotPassword(contestId: String!, email: String!): User!
    // resetPassword(
    //   contestId: String!,
    //   email: String!,
    //   oneTimeCode: String!,
    //   password: String!
    // ): User!
    // addUser(email: String!, permission: [Permission!]!): User!
    // setMyPassword(
    //   oldPassword: string,
    //   newPassword: string
    // ): User!
    // setMyName(name: string): Promise<void>
    // setUserPermissions(
    //   userId: String!,
    //   permissions: [Permission!]!
    // ): User!
    // setMyProfile(
    //   gender: GenderType,
    //   shirtSize: ShirtSizeType,
    //   address: String
    // ): Profile!
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
    signin: signinResolver(store),
    signup: signupResolver(store),
  },
  Query: {
    user: userByTokenResolver(store),
    userById: userByIdResolver(store),
    userByEmail: userByEmailResolver(store),
    userByUsername: userByUsernameResolver(store),
  },
})
