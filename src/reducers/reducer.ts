import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { History } from 'history'
import { Reducer } from 'redux'

import { TitleAction, TitleState, titleReducer } from './Title'

export interface AppState {
    title: TitleState
}

export type AppAction = TitleAction

export type AppReducer = Reducer<AppState>

export const createReducer = (history: History) => combineReducers<AppState>({
    router: connectRouter(history),
    title: titleReducer,
})
