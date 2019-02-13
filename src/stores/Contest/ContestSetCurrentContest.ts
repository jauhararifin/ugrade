import { ContestActionType } from './ContestAction'
import { Contest, ContestState } from './ContestState'

export interface ContestSetCurrentContest {
  type: ContestActionType.SetCurrentContest
  contest: Contest
}

export function setCurrentContest(contest: Contest): ContestSetCurrentContest {
  return {
    type: ContestActionType.SetCurrentContest,
    contest,
  }
}

export function setCurrentContestReducer(
  state: ContestState,
  action: ContestSetCurrentContest
): ContestState {
  return {
    ...state,
    currentContest: {
      ...action.contest,
      announcements: action.contest.announcements
        ? action.contest.announcements
            .sort((a, b) => b.issuedTime.getTime() - a.issuedTime.getTime())
            .slice()
        : undefined,
    },
  }
}
