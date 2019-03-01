import { ConnectedRouter } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { StoreContext } from 'redux-react-hook'
import App from 'ugrade/scenes/App'
import { InMemoryAuthService } from './services/auth'
import { InMemoryContestService } from './services/contest/InMemoryContestService'
import { InMemoryProblemService } from './services/problem'
import { InMemoryServerStatusService } from './services/serverStatus'
import { InMemoryUserService } from './services/user'
import * as serviceWorker from './serviceWorker'
import { createStore } from './store'

import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'

const history = createBrowserHistory()
const serverStatusService = new InMemoryServerStatusService()
const authService = new InMemoryAuthService(serverStatusService)
const userService = new InMemoryUserService(authService)
const problemService = new InMemoryProblemService(serverStatusService)
const contestService = new InMemoryContestService(
  serverStatusService,
  authService
)

export const store = createStore(history, {
  authService,
  userService,
  serverStatusService,
  contestService,
  problemService,
})

ReactDOM.render(
  <Provider store={store}>
    <StoreContext.Provider value={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </StoreContext.Provider>
  </Provider>,
  document.getElementById('root')
)

serviceWorker.unregister()