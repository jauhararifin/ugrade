import { Reducer } from 'redux'

import { ServerStatusActionType } from './ServerStatusAction'
import {
  ServerStatusSetOnline,
  setOnlineReducer,
} from './ServerStatusSetOnline'
import {
  ServerStatusSetServerClock,
  setServerClockReducer,
} from './ServerStatusSetServerClock'
import { initialState, ServerStatusState } from './ServerStatusState'

export const serverStatusReducer: Reducer<ServerStatusState> = (
  state: ServerStatusState = initialState,
  action
): ServerStatusState => {
  switch (action.type) {
    case ServerStatusActionType.SetServerClock:
      return setServerClockReducer(state, action as ServerStatusSetServerClock)
    case ServerStatusActionType.SetOnline:
      return setOnlineReducer(state, action as ServerStatusSetOnline)
  }
  return state
}
