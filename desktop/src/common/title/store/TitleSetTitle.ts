import { TitleActionType } from './TitleAction'
import { TitleState } from './TitleState'

export interface TitleSetTitle {
  type: TitleActionType.SetTitle
  title: string
}

export function setTitle(title: string = 'UGrade'): TitleSetTitle {
  return {
    type: TitleActionType.SetTitle,
    title,
  }
}

export function setTitleReducer(_state: TitleState, action: TitleSetTitle) {
  return action.title
}
