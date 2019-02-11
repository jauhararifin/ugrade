import { Reducer } from 'redux'
import { ServerStatusActionType } from './ServerStatusAction'
import { initialState, ServerStatusState } from './ServerStatusState'

export const serverStatusReducer: Reducer<ServerStatusState> = (
  state: ServerStatusState = initialState,
  action
): ServerStatusState => {
  switch (action.type) {
    case ServerStatusActionType.SetServerClock:
      return {
        ...state,
        clock: action.clock,
        localClock: action.localClock,
      }
  }
  return state
}
