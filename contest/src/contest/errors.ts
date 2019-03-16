import { ApolloError } from 'apollo-server-core'

export const NO_SUCH_CONTEST = new ApolloError(
  'No Such Contest',
  'NO_SUCH_CONTEST'
)
