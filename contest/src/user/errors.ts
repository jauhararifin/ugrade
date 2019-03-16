import { ApolloError } from 'apollo-server-core'

export const NO_SUCH_USER = new ApolloError('No Such User', 'NO_SUCH_USER')
