import { ContestActionType } from './ContestAction'
import { ContestInfo, ContestState } from './ContestState'

export interface ContestSetInfo {
  type: ContestActionType.SetInfo
  contestInfo: ContestInfo
}

export function setContest(contestInfo: ContestInfo): ContestSetInfo {
  return {
    type: ContestActionType.SetInfo,
    contestInfo,
  }
}

export function setContestReducer(
  state: ContestState,
  action: ContestSetInfo
): ContestState {
  if (state.info && state.info.id === action.contestInfo.id) {
    return {
      ...state,
      info: action.contestInfo,
    }
  }
  return { info: action.contestInfo }
}
