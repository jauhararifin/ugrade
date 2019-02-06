import { Reducer } from "redux"
import { ContestState, initialValue } from "./ContestState"
import { ContestActionType } from "./ContestAction"

export const contestReducer: Reducer<ContestState> = (state: ContestState = initialValue, action): ContestState => {
    switch (action.type) {
        case ContestActionType.SetContests:
            return {
                ...state,
                contests: action.contests
            }
        
        case ContestActionType.SetCurrentContest:
            return {
                ...state,
                currentContest: action.contest
            }
    }
    return state
}