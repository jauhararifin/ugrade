import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { History } from 'history'
import { Reducer } from 'redux'

import { titleReducer } from './Title'
import { AppState } from './state'

export type AppReducer = Reducer<AppState>

export const createReducer = (history: History) => combineReducers<AppState>({
    router: connectRouter(history),
    title: titleReducer,
})
