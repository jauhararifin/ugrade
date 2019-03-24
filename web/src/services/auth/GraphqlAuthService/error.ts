import { ApolloError } from 'apollo-boost'
import {
  AuthError,
  ForbiddenActionError,
  InvalidTokenError,
  NoSuchUserError,
  UserAlreadyAddedError,
  UserRegistrationError,
} from '../errors'

export function convertError(err: Error): any {
  if (err instanceof ApolloError) {
    for (const gerr of err.graphQLErrors) {
      const code = gerr.extensions && gerr.extensions.code
      if (code === 'ForbiddenAction') throw new ForbiddenActionError(gerr.message)
      if (code === 'NoSuchUser') throw new NoSuchUserError(gerr.message)
      if (code === 'WrongPassword') throw new AuthError(gerr.message)
      if (code === 'InvalidToken') throw new InvalidTokenError(gerr.message)
      if (code === 'InvalidCredential') throw new AuthError(gerr.message)
      if (code === 'InvalidCode') throw new AuthError(gerr.message)
      if (code === 'AuthError') throw new AuthError(gerr.message)
      if (code === 'AlreadyUsedUsername') throw new UserRegistrationError(gerr.message)
      if (code === 'AlreadyRegistered') throw new UserRegistrationError(gerr.message)
      if (code === 'AlreadyInvitedUser') throw new UserAlreadyAddedError(gerr.message)
    }
  }
  throw err
}
