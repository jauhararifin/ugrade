import { setContext } from 'apollo-link-context'
import { useEffect } from 'react'
import { useRouting } from './routing'

export const TOKEN_STORAGE_KEY = 'ugrade.auth.token'

function sendTokenToElectron(token?: string) {
  const win = window as any
  if (win.require) {
    const ipcRenderer = win.require('electron').ipcRenderer
    if (ipcRenderer) {
      ipcRenderer.send('token', token)
    }
  }
}

export function getToken(): string | undefined {
  const token = sessionStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem(TOKEN_STORAGE_KEY)
  if (token) {
    sendTokenToElectron(token)
    return token
  }
  return undefined
}

export function setToken(token: string, persistent: boolean = false) {
  sendTokenToElectron(token)
  sessionStorage.setItem(TOKEN_STORAGE_KEY, token)
  if (persistent) localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function clearToken() {
  sendTokenToElectron(undefined)
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
