export enum TitleActionType {
    SetReducer = "ACTION_TYPE_SET_REDUCER"
}

export interface TitleAction {
    type: TitleActionType
    title: string
}

export function setTitle(title:string = "UGrade"): TitleAction {
    return {
        type: TitleActionType.SetReducer,
        title
    }
}