import { ApolloError } from 'apollo-server-core'
import { AuthError } from 'ugrade/auth'
import { ContestError } from 'ugrade/contest'
import { LanguageError } from 'ugrade/language'
import { ProfileError } from 'ugrade/profile/ProfileError'
import { ValidationError } from 'yup'

/**
 * wrap wraps result that returned by ugrade services and convert error to apollo error.
 * It takes promise `promise` and return another promise. When `promise` is resolved, it just
 * return the `promise`. When `promise` is rejected it returns another rejected promise that
 * has been converted to ApolloError.
 */
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
