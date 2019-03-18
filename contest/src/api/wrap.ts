import { ApolloError } from 'apollo-server-core'
import { AuthError } from 'ugrade/auth'
import { ValidationError } from 'yup'

export const wrap = async <T>(promise: Promise<T>): Promise<T> => {
  try {
    return await promise
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new ApolloError(error.message, 'INVALID_INPUT', error.errors)
    }
    if (error instanceof AuthError) {
      throw new ApolloError(error.message, 'AUTH_ERROR')
    }
    throw error
  }
}
