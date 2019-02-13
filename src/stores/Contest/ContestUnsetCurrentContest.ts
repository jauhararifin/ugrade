import { ContestActionType } from './ContestAction'
import { ContestState } from './ContestState'

export interface ContestUnsetCurrentContest {
  type: ContestActionType.UnsetCurrentContest
}

export function unsetCurrentContest(): ContestUnsetCurrentContest {
  return {
    type: ContestActionType.UnsetCurrentContest,
  }
}

export function unsetCurrentContestReducer(
  state: ContestState,
  _action: ContestUnsetCurrentContest
): ContestState {
  return { ...state, currentContest: undefined }
}
