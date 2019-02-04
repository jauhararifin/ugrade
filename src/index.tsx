import React from 'react'
import ReactDOM from 'react-dom'
import { Provider} from 'react-redux'
import logger from 'redux-logger'
import { createBrowserHistory } from 'history'

import "@blueprintjs/core/lib/css/blueprint.css"
import "@blueprintjs/icons/lib/css/blueprint-icons.css"

import './index.css'
import App from './scenes/App'
import createReducer, { AppState } from './reducers/reducer'
import * as serviceWorker from './serviceWorker'
import { createStore, compose, applyMiddleware } from 'redux';
import { routerMiddleware, ConnectedRouter } from 'connected-react-router';

const history = createBrowserHistory()
const store = createStore(
    createReducer(history),
    compose(
        applyMiddleware(
            routerMiddleware(history)
        ),
        applyMiddleware(logger)
    )
)

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>
, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
