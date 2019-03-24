import { ConnectedRouter } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { StoreContext } from 'redux-react-hook'
import App from 'ugrade/scenes/App'
import { initConfig } from './config'
import { ErrorBoundary } from './ErrorBoundary'
import * as serviceWorker from './serviceWorker'
import { createStore } from './store'

import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'

const history = createBrowserHistory()
const config = initConfig()

export const store = createStore(history, config)

ReactDOM.render(
  <ErrorBoundary>
    <Provider store={store}>
      <StoreContext.Provider value={store}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </StoreContext.Provider>
    </Provider>
  </ErrorBoundary>,
  document.getElementById('root')
)

serviceWorker.unregister()
