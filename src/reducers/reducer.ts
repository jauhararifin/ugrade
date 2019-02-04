import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { History } from 'history'

import TitleReducer from './title'

export interface AppState {
    title: string
}

export default (history: History) => combineReducers<AppState>({
    router: connectRouter(history),
    title: TitleReducer,
})
