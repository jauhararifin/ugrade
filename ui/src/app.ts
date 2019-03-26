import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost'
import { createBrowserHistory } from 'history'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import { createContext, useContext } from 'react'
import { AuthStore } from './auth'
import { ContestStore } from './contest'
import { ServerStore } from './server'
import { WindowStore } from './window'

export const browserHistory = createBrowserHistory()
export const routingStore = new RouterStore()
export const history = syncHistoryWithStore(browserHistory, routingStore)

export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:8000/graphql' }),
  cache: new InMemoryCache(),
})
export const authStore = new AuthStore()
export const contestStore = new ContestStore(authStore)
export const serverStore = new ServerStore()
export const windowStore = new WindowStore()

export const appContext = createContext({
  routingStore,
  apolloClient,
  authStore,
  contestStore,
  serverStore,
  windowStore,
})

export const useWindow = () => useContext(appContext).windowStore
export const useServer = () => useContext(appContext).serverStore
export const useContest = () => useContext(appContext).contestStore
export const useAuth = () => useContext(appContext).authStore
export const useApollo = () => useContext(appContext).apolloClient
export const useRouting = () => useContext(appContext).routingStore
