import { setContext } from 'apollo-link-context'

export const TOKEN_STORAGE_KEY = 'ugrade.auth.token'

export const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem(TOKEN_STORAGE_KEY)
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})
