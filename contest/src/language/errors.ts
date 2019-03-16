import { ApolloError } from 'apollo-server-core'

export const NO_SUCH_LANGUAGE = new ApolloError(
  'No Such Language',
  'NO_SUCH_LANGUAGE'
)
