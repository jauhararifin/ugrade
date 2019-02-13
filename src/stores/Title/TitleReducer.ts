import { TitleAction, TitleActionType } from './TitleAction'
import { setTitleReducer, TitleSetTitle } from './TitleSetTitle'
import { initialValue, TitleState } from './TitleState'

export function titleReducer(
  state: TitleState = initialValue,
  action: TitleAction
) {
  switch (action.type) {
    case TitleActionType.SetTitle:
      return setTitleReducer(state, action as TitleSetTitle)
  }
  return state
}
