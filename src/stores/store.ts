import { combineReducers, createStore } from 'redux'

export interface AppState {
}

const rootReducer = combineReducers<AppState>({
})

const store  = createStore<AppState, any, any, any>(rootReducer, {})

export default store
