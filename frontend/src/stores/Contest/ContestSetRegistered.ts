import { ContestActionType } from './ContestAction'
import { ContestState } from './ContestState'

export interface ContestSetRegistered {
  type: ContestActionType.SetRegistered
  registered: boolean
}

export function setRegistered(registered: boolean): ContestSetRegistered {
  return {
    type: ContestActionType.SetRegistered,
    registered,
  }
}

export function setRegisteredReducer(
  state: ContestState,
  action: ContestSetRegistered
): ContestState {
  if (state.id) {
    return {
      ...state,
      registered: action.registered,
    }
  }
  return { ...state }
}
