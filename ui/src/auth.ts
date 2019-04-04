import { setContext } from 'apollo-link-context'
import { useEffect } from 'react'
import { useRouting } from './routing'

export const TOKEN_STORAGE_KEY = 'ugrade.auth.token'

export function getToken(): string | undefined {
  const token = sessionStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem(TOKEN_STORAGE_KEY)
  if (token) return token
  return undefined
}

export function setToken(token: string, persistent: boolean = false) {
  sessionStorage.setItem(TOKEN_STORAGE_KEY, token)
  if (persistent) localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

export const authLink = setContext((_, { headers }) => {
  const token = getToken()
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

export function usePublicOnly(to: string = '/contest') {
  const routing = useRouting()
  const isSignedIn = getToken()
  useEffect(() => {
    if (isSignedIn) routing.push(to)
  }, [isSignedIn])
}

export function useContestOnly(to: string = '/enter-contest') {
  const routing = useRouting()
  const isSignedIn = getToken()
  useEffect(() => {
    if (!isSignedIn) routing.push(to)
  }, [isSignedIn])
}
