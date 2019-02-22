import { connectRouter } from 'connected-react-router'
import { History } from 'history'
import { combineReducers, Reducer } from 'redux'

import { authReducer } from './Auth'
import { contestReducer } from './Contest'
import { serverStatusReducer } from './ServerStatus'
import { settingReducer } from './Setting'
import { AppState } from './state'
import { titleReducer } from './Title'

export type AppReducer = Reducer<AppState>

export const createReducer = (history: History) =>
  combineReducers<AppState>({
    router: connectRouter(history),
    title: titleReducer,
    auth: authReducer,
    setting: settingReducer,
    server: serverStatusReducer,
    contest: contestReducer,
  })
