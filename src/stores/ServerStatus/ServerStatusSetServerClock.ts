import { ServerStatusActionType } from './ServerStatusAction'
import { initialState, ServerStatusState } from './ServerStatusState'

export interface ServerStatusSetServerClock {
  type: ServerStatusActionType.SetServerClock
  clock: Date
  localClock: Date
}

export function setServerClock(
  clock: Date,
  localClock?: Date
): ServerStatusSetServerClock {
  return {
    type: ServerStatusActionType.SetServerClock,
    clock,
    localClock: localClock || new Date(),
  }
}

export function setServerClockReducer(
  state: ServerStatusState = initialState,
  action: ServerStatusSetServerClock
) {
  return {
    ...state,
    clock: action.clock,
    localClock: action.localClock,
  }
}
