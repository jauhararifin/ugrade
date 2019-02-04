import { Reducer } from "redux"

export type TitleState = string

export const initialValue: TitleState = "UGrade"

export enum TitleActionType {
    SetReducer = "ACTION_TYPE_SET_REDUCER"
}

export interface TitleAction {
    type: TitleActionType
    title: string
}

export function setTitle(title:string = "UGrade") {
    return {
        type: TitleActionType,
        title
    }
}

export const titleReducer: Reducer<TitleState> = (state: TitleState = initialValue, action): TitleState => {
    if (action.type === TitleActionType.SetReducer) {
        return action.title
    }
    return state
}
