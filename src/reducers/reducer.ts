import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { History } from 'history'

export interface AppState {
}

export default (history: History) => combineReducers<AppState>({
    router: connectRouter(history),
})
