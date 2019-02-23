import { ContestActionType } from './ContestAction'
import { ContestInfo, ContestState } from './ContestState'

export interface ContestSetContest {
  type: ContestActionType.SetContest
  id: string
  shortId: string
  contestInfo: ContestInfo
}

export function setContest(
  id: string,
  shortId: string,
  contestInfo: ContestInfo
): ContestSetContest {
  return {
    type: ContestActionType.SetContest,
    id,
    shortId,
    contestInfo,
  }
}

export function setContestReducer(
  state: ContestState,
  action: ContestSetContest
): ContestState {
  if (state.id && state.id === action.id) {
    return {
      ...state,
      id: action.id,
      shortId: action.shortId,
      info: action.contestInfo,
    }
  }
  return { id: action.id, shortId: action.shortId, info: action.contestInfo }
}
