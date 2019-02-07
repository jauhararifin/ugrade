import { compose, createStore as createReduxStore, applyMiddleware, Middleware } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import logger from 'redux-logger'
import thunk, { ThunkDispatch, ThunkAction } from 'redux-thunk'

import ErrorToaster from '../middlewares/ErrorToaster/ErrorToaster'
import { AuthService } from '../services/auth'
import { History } from 'history'
import { createReducer } from './reducer'
import { AppState } from './state'
import { AppAction } from './action'
import { ServerStatusService } from '../services/serverStatus'
import { ContestService } from '../services/contest/ContestService'

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

export interface ThunkExtraArguments {
    authService: AuthService
    serverStatusService: ServerStatusService
    contestService: ContestService
}

export type AppThunkDispatch = ThunkDispatch<AppState, ThunkExtraArguments, AppAction>
export type AppThunkAction<T = void> = ThunkAction<Promise<T>, AppState, ThunkExtraArguments, AppAction>

export const createStore = (history: History, thunkExtraArguments: ThunkExtraArguments) => {
    const store = createReduxStore<AppState, AppAction, {}, {}>(
        createReducer(history),
        compose(
            applyMiddleware(
                routerMiddleware(history),
                ErrorToaster as Middleware,
                logger,
                thunk.withExtraArgument(thunkExtraArguments)
            ),
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__() || compose,
        )
    )
    return store
}