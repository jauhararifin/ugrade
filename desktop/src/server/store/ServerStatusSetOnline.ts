import { ServerStatusActionType } from './ServerStatusAction'
import { initialState, ServerStatusState } from './ServerStatusState'

export interface ServerStatusSetOnline {
  type: ServerStatusActionType.SetOnline
  online: boolean
}

export function setOnline(online: boolean): ServerStatusSetOnline {
  return {
    type: ServerStatusActionType.SetOnline,
    online,
  }
}

export function setOnlineReducer(
  state: ServerStatusState = initialState,
  action: ServerStatusSetOnline
) {
  return {
    ...state,
    online: action.online,
  }
}
