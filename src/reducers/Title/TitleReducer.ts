import { Reducer } from "redux"
import { initialValue, TitleState } from "./TitleState"
import { TitleActionType } from "./TitleAction"

export const titleReducer: Reducer<TitleState> = (state: TitleState = initialValue, action): TitleState => {
    if (action.type === TitleActionType.SetReducer) {
        return action.title
    }
    return state
}