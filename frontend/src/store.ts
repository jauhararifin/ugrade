import {
  connectRouter,
  RouterAction,
  routerMiddleware,
  RouterState,
} from 'connected-react-router'
import { History } from 'history'
import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore as createReduxStore,
  Reducer,
} from 'redux'
import logger from 'redux-logger'
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk'
import {
  ContestAction,
  contestReducer,
  ContestState,
} from 'ugrade/contest/store'
import { AuthService } from 'ugrade/services/auth'
import { ContestService } from 'ugrade/services/contest/ContestService'
import { ProblemService } from 'ugrade/services/problem'
import { ServerStatusService } from 'ugrade/services/serverStatus'
import { UserService } from 'ugrade/services/user'
import { AuthAction, authReducer, AuthState } from 'ugrade/stores/Auth'
import {
  ServerStatusAction,
  serverStatusReducer,
  ServerStatusState,
} from 'ugrade/stores/ServerStatus'
import {
  SettingAction,
  settingReducer,
  SettingState,
} from 'ugrade/stores/Setting'
import { TitleAction, titleReducer, TitleState } from 'ugrade/stores/Title'
import {
  UserProfileAction,
  userProfileReducer,
  UserProfileState,
} from 'ugrade/userprofile/store'

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

export interface AppState {
  router: RouterState
  title: TitleState
  auth: AuthState
  setting: SettingState
  server: ServerStatusState
  contest: ContestState
  userProfile: UserProfileState
}

export type AppReducer = Reducer<AppState>

export const createReducer = (history: History) =>
  combineReducers<AppState>({
    router: connectRouter(history),
    title: titleReducer,
    auth: authReducer,
    setting: settingReducer,
    server: serverStatusReducer,
    contest: contestReducer,
    userProfile: userProfileReducer,
  })

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

export type AppAction =
  | TitleAction
  | RouterAction
  | AuthAction
  | SettingAction
  | ServerStatusAction
  | ContestAction
  | UserProfileAction

export const createStore = (
  history: History,
  thunkExtraArguments: ThunkExtraArguments
) => {
  const store = createReduxStore<AppState, AppAction, {}, {}>(
    createReducer(history),
    compose(
      applyMiddleware(
        routerMiddleware(history),
        thunk.withExtraArgument(thunkExtraArguments),
        logger
      ),
      (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()) ||
        compose
    )
  )
  return store
}
