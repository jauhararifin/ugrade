import { routerMiddleware } from 'connected-react-router'
import {
  applyMiddleware,
  compose,
  createStore as createReduxStore,
} from 'redux'
import logger from 'redux-logger'
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk'

import { History } from 'history'
import { AuthService } from '../services/auth'
import { ContestService } from '../services/contest/ContestService'
import { ProblemService } from '../services/problem'
import { ServerStatusService } from '../services/serverStatus'
import { UserService } from '../services/user'
import { AppAction } from './action'
import { createReducer } from './reducer'
import { AppState } from './state'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose
  }
}

export interface ThunkExtraArguments {
  authService: AuthService
  serverStatusService: ServerStatusService
  contestService: ContestService
  problemService: ProblemService
  userService: UserService
}

export type AppThunkDispatch = ThunkDispatch<
  AppState,
  ThunkExtraArguments,
  AppAction
>
export type AppThunkAction<T = void> = ThunkAction<
  Promise<T>,
  AppState,
  ThunkExtraArguments,
  AppAction
>

export const createStore = (
  history: History,
  thunkExtraArguments: ThunkExtraArguments
) => {
  const store = createReduxStore<AppState, AppAction, {}, {}>(
    createReducer(history),
    compose(
      applyMiddleware(
        routerMiddleware(history),
        logger,
        thunk.withExtraArgument(thunkExtraArguments)
      ),
      (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()) ||
        compose
    )
  )
  return store
}
