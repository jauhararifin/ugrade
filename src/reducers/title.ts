import { Reducer } from "redux"

const ACTION_TYPE_SET_REDUCER = 'ACTION_TYPE_SET_REDUCER'

export function setTitle(title:string = "UGrade") {
    return {
        type: ACTION_TYPE_SET_REDUCER,
        title
    }
}

const titleReducer: Reducer<string> = (state: string = "UGrade", action): string => {
    if (action.type === ACTION_TYPE_SET_REDUCER) {
        return action.title
    }
    return state
}

export default titleReducer