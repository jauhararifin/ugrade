import { ContestActionType } from './ContestAction'
import { Contest, ContestState } from './ContestState'

export interface ContestSetContests {
  type: ContestActionType.SetContests
  contests: Contest[]
}

export function setContests(contests: Contest[]): ContestSetContests {
  return {
    type: ContestActionType.SetContests,
    contests,
  }
}

export function setContestsReducer(
  state: ContestState,
  action: ContestSetContests
) {
  return {
    ...state,
    contests: action.contests,
  }
}
