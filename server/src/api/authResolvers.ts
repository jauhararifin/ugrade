import { AuthService, Permission, User } from 'ugrade/auth'
import { AppFieldResolver } from './resolvers'
import { wrap } from './wrap'

export type SigninResolver = AppFieldResolver<
  any,
  { contestId: string; email: string; password: string },
  Promise<string>
>

export type SignupResolver = AppFieldResolver<
  any,
  {
    contestId: string
    username: string
    email: string
    oneTimeCode: string
    password: string
    name: string
  },
  Promise<string>
>

export type ForgotPasswordResolver = AppFieldResolver<
  any,
  { contestId: string; email: string },
  Promise<User>
>

export type ResetPasswordResolver = AppFieldResolver<
  any,
  {
    contestId: string
    email: string
    oneTimeCode: string
    password: string
  },
  Promise<User>
>

export type AddUserResolver = AppFieldResolver<
  any,
  { email: string; permissions: Permission[] },
  Promise<User>
>

export type SetMyPasswordResolver = AppFieldResolver<
  any,
  { oldPassword: string; newPassword: string },
  Promise<User>
>

export type SetMyNameResolver = AppFieldResolver<
  any,
  { name: string },
  Promise<User>
>

export type SetPermissionsResolver = AppFieldResolver<
  any,
  { userId: string; permissions: Permission[] },
  Promise<User>
>

export type UserByTokenResolver = AppFieldResolver<any, any, Promise<User>>

export type UserByIdResolver = AppFieldResolver<
  any,
  { id: string },
  Promise<User>
>

export type UserByEmailResolver = AppFieldResolver<
  any,
  { contestId: string; email: string },
  Promise<User>
>

export type UserByUsernameResolver = AppFieldResolver<
  any,
  { contestId: string; username: string },
  Promise<User>
>

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

export const createAuthResolvers = (service: AuthService): AuthResolvers => {
  return {
    Mutation: {
      signin: (_source, { contestId, email, password }) =>
        wrap(service.signin(contestId, email, password)),
      signup: (
        _source,
        { contestId, username, email, oneTimeCode, password, name }
      ) =>
        wrap(
          service.signup(
            contestId,
            username,
            email,
            oneTimeCode,
            password,
            name
          )
        ),
      forgotPassword: (_source, { contestId, email }) =>
        wrap(service.forgotPassword(contestId, email)),
      resetPassword: (_source, { contestId, email, oneTimeCode, password }) =>
        wrap(service.resetPassword(contestId, email, oneTimeCode, password)),
      addUser: (_source, { email, permissions }, { authToken }) =>
        wrap(service.addUser(authToken, email, permissions)),
      setMyPassword: (_source, { oldPassword, newPassword }, { authToken }) =>
        wrap(service.setMyPassword(authToken, oldPassword, newPassword)),
      setMyName: (_source, { name }, { authToken }) =>
        wrap(service.setMyName(authToken, name)),
      setPermissions: (_source, { userId, permissions }, { authToken }) =>
        wrap(service.setPermissions(authToken, userId, permissions)),
    },
    Query: {
      user: (_source, _args, { authToken }) => wrap(service.getMe(authToken)),
      userById: (_source, { id }) => wrap(service.getUserById(id)),
      userByEmail: (_source, { contestId, email }) =>
        wrap(service.getUserByEmail(contestId, email)),
      userByUsername: (_source, { contestId, username }) =>
        wrap(service.getUserByUsername(contestId, username)),
    },
  }
}