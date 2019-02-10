import React from 'react'
import ReactDOM from 'react-dom'
import { Provider} from 'react-redux'
import { createBrowserHistory } from 'history'
import { ConnectedRouter } from 'connected-react-router'

import './index.css'
import App from './scenes/App'
import { createStore } from './stores'
import * as serviceWorker from './serviceWorker'
import { InMemoryAuthService } from './services/auth'
import { InMemoryServerStatusService } from './services/serverStatus'
import { InMemoryContestService } from './services/contest/InMemoryContestService'

const history = createBrowserHistory()
const authService           = new InMemoryAuthService()
const serverStatusService   = new InMemoryServerStatusService()
const contestService        = new InMemoryContestService(authService)
const store = createStore(history, { authService, serverStatusService, contestService })

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>
, document.getElementById('root'))

serviceWorker.unregister()
