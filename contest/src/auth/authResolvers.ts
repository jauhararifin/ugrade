import { AddUserResolver, addUserResolver } from './addUserResolver'
import {
  ForgotPasswordResolver,
  forgotPasswordResolver,
} from './forgotPasswordResolver'
import {
  ResetPasswordResolver,
  resetPasswordResolver,
} from './resetPasswordResolver'
import { SetMyNameResolver, setMyNameResolver } from './setMyNameResolver'
import {
  SetMyPasswordResolver,
  setMyPasswordResolver,
} from './setMyPasswordResolver'
import {
  SetPermissionsResolver,
  setPermissionsResolver,
} from './setPermissionsResolver'
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
    forgotPassword: ForgotPasswordResolver
    resetPassword: ResetPasswordResolver
    addUser: AddUserResolver
    setMyPassword: SetMyPasswordResolver
    setMyName: SetMyNameResolver
    setPermissions: SetPermissionsResolver
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
    forgotPassword: forgotPasswordResolver(store),
    resetPassword: resetPasswordResolver(store),
    addUser: addUserResolver(store),
    setMyPassword: setMyPasswordResolver(store),
    setMyName: setMyNameResolver(store),
    setPermissions: setPermissionsResolver(store),
  },
  Query: {
    user: userByTokenResolver(store),
    userById: userByIdResolver(store),
    userByEmail: userByEmailResolver(store),
    userByUsername: userByUsernameResolver(store),
  },
})
