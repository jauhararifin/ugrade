import { createBrowserHistory } from 'history'
import { createContext, useContext, useEffect, useState } from 'react'

export const browserHistory = createBrowserHistory()

export const routingContext = createContext(browserHistory)

export function useRouting() {
  const routing = useContext(routingContext)
  const [, updateState] = useState()
  useEffect(() => routing.listen(updateState), [routing])
  return routing
}
