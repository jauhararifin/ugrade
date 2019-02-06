import { Reducer } from "redux"
import { ServerStatusState, initialState } from "./ServerStatusState"
import { ServerStatusActionType } from "./ServerStatusAction"

export const serverStatusReducer: Reducer<ServerStatusState> = (state: ServerStatusState = initialState, action): ServerStatusState => {
    switch (action.type) {
        case ServerStatusActionType.SetServerClock:
            return {
                ...state,
                clock: action.clock,
                localClock: action.localClock
            }
    }
    return state
}