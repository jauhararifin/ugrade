import { ApolloError } from 'apollo-boost'
import { ValidationError } from 'yup'

export function convertGraphqlError(error: Error) {
  if (error instanceof ApolloError) {
    for (const err of error.graphQLErrors) {
      // handle validation error
      if (err.code === 'InvalidInput') {
        let messages: string[] = []
        for (const key in err.validations) {
          if (err.validations.hasOwnProperty(key)) {
            messages = messages.concat(err.validations[key])
          }
        }
        return new ValidationError(messages, err.validations, '')
      }

      return new Error(err.message)
    }
  }
  return error
}
