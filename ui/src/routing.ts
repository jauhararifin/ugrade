import { createBrowserHistory } from 'history'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'

export const browserHistory = createBrowserHistory()
export const routingStore = new RouterStore()
export const history = syncHistoryWithStore(browserHistory, routingStore)

export function useRouting() {
  return routingStore
}
