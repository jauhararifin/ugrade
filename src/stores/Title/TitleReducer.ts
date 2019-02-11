import { Reducer } from 'redux'
import { TitleActionType } from './TitleAction'
import { initialValue, TitleState } from './TitleState'

export const titleReducer: Reducer<TitleState> = (
  state: TitleState = initialValue,
  action
): TitleState => {
  if (action.type === TitleActionType.SetTitle) {
    return action.title
  }
  return state
}
