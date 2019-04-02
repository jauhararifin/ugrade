import { ApolloLink, InMemoryCache } from 'apollo-boost'
import { ApolloClient } from 'apollo-client'
import { createUploadLink } from 'apollo-upload-client'
import { authLink } from './auth'

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([
    authLink,
    createUploadLink({
      uri: 'http://localhost:8000/graphql',
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
