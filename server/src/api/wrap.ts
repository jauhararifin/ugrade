import { ApolloError } from 'apollo-server-core'
import { AuthError } from 'ugrade/auth'
import { ValidationError } from 'yup'
import { ContestError } from 'ugrade/contest'
import { LanguageError } from 'ugrade/language'
import { ProfileError } from 'ugrade/profile/ProfileError'

export const wrap = async <T>(promise: Promise<T>): Promise<T> => {
  try {
    return await promise
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new ApolloError(error.message, 'InvalidInput', error.errors)
    }
    if (
      error instanceof AuthError ||
      error instanceof ContestError ||
      error instanceof LanguageError ||
      error instanceof ProfileError
    ) {
      throw new ApolloError(error.message, error.constructor.name)
    }
    throw new ApolloError(error.message, 'ServerError')
  }
}
