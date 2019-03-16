import { ApolloError } from 'apollo-server-core'

export const INVALID_CREDENTIAL = new ApolloError(
  'Invalid Credential',
  'INVALID_CREDENTIAL'
)

export const INVALID_TOKEN = new ApolloError('Invalid Token', 'INVALID_TOKEN')

export const FORBIDDEN_ACTION = new ApolloError(
  'Fobidden Action',
  'FORBIDDEN_ACTION'
)
