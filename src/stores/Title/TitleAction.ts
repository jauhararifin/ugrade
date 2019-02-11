export enum TitleActionType {
  SetTitle = 'ACTION_TYPE_SET_TITLE',
}

export interface TitleAction {
  type: TitleActionType
  title: string
}

export function setTitle(title: string = 'UGrade'): TitleAction {
  return {
    type: TitleActionType.SetTitle,
    title,
  }
}
