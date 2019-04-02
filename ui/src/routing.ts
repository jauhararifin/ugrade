import { createBrowserHistory } from 'history'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import { useEffect, useState } from 'react'

export const browserHistory = createBrowserHistory()
export const routingStore = new RouterStore()
export const history = syncHistoryWithStore(browserHistory, routingStore)

export function useRouting() {
  return routingStore
}

export function useMatch(regex: RegExp): string[] {
  const routing = useRouting()
  const [match, setMatch] = useState(routing.location.pathname.match(regex))
  useEffect(() => {
    const newMatch = routing.location.pathname.match(regex)
    if (newMatch) setMatch(newMatch)
  }, [routing.location])
  return match || []
}
