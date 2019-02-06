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

const history = createBrowserHistory()
const store = createStore(history, {
    authService: new InMemoryAuthService(),
    serverStatusService: new InMemoryServerStatusService()
})

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>
, document.getElementById('root'))

serviceWorker.unregister()
