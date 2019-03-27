import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost'
import { createBrowserHistory } from 'history'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import { createContext, useContext } from 'react'
import { AuthStore } from './auth'
import { ContestStore } from './contest'
import { ProblemStore } from './problem'
import { ServerStore } from './server'
import { SubmissionStore } from './submission'
import { WindowStore } from './window'

export const browserHistory = createBrowserHistory()
export const routingStore = new RouterStore()
export const history = syncHistoryWithStore(browserHistory, routingStore)

export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:8000/graphql', credentials: 'same-origin' }),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
    },
  },
})
export const authStore = new AuthStore(apolloClient)
export const contestStore = new ContestStore(authStore, apolloClient)
export const problemStore = new ProblemStore(authStore, contestStore, apolloClient)
export const submissionStore = new SubmissionStore()
export const serverStore = new ServerStore(apolloClient)
export const windowStore = new WindowStore()

export const appContext = createContext({
  routingStore,
  apolloClient,
  authStore,
  contestStore,
  problemStore,
  submissionStore,
  serverStore,
  windowStore,
})

export const useWindow = () => useContext(appContext).windowStore
export const useServer = () => useContext(appContext).serverStore
export const useProblem = () => useContext(appContext).problemStore
export const useContest = () => useContext(appContext).contestStore
export const useSubmission = () => useContext(appContext).submissionStore
export const useAuth = () => useContext(appContext).authStore
export const useApollo = () => useContext(appContext).apolloClient
export const useRouting = () => useContext(appContext).routingStore
