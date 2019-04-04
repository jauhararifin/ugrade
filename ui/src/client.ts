import { ApolloLink, InMemoryCache } from 'apollo-boost'
import { ApolloClient } from 'apollo-client'
import { createUploadLink } from 'apollo-upload-client'
import { authLink } from './auth'
import { GRAPHQL_API } from './config'

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([
    authLink,
    createUploadLink({
      uri: GRAPHQL_API,
      credentials: 'same-origin',
    }),
  ]),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
    },
  },
})
