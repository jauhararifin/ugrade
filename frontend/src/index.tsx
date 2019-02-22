import { ConnectedRouter } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

// tslint:disable-next-line:no-submodule-imports
import '@blueprintjs/core/lib/css/blueprint.css'
// tslint:disable-next-line:no-submodule-imports
import '@blueprintjs/icons/lib/css/blueprint-icons.css'

import App from './scenes/App'
import { InMemoryAuthService } from './services/auth'
import { InMemoryContestService } from './services/contest/InMemoryContestService'
import { InMemoryProblemService } from './services/problem'
import { InMemoryServerStatusService } from './services/serverStatus'
import * as serviceWorker from './serviceWorker'
import { createStore } from './stores'

const history = createBrowserHistory()
const authService = new InMemoryAuthService()
const problemService = new InMemoryProblemService()
const serverStatusService = new InMemoryServerStatusService()
const contestService = new InMemoryContestService(authService)
const store = createStore(history, {
  authService,
  serverStatusService,
  contestService,
  problemService,
})

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)

serviceWorker.unregister()
