import createReducer from './reducer'
import { TitleAction } from './title'

export { createReducer }

export type AppAction = TitleAction

export * from './reducer'