import { ContestActionType } from './ContestAction'
import { ContestState } from './ContestState'

export interface ContestUnsetContest {
  type: ContestActionType.UnsetContest
}

export function unsetContest(): ContestUnsetContest {
  return {
    type: ContestActionType.UnsetContest,
  }
}

export function unsetContestReducer(_state: ContestState, _action: ContestUnsetContest): ContestState {
  return {}
}
