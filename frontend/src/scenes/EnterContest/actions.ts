import { Contest } from '../../services/contest/Contest'
import { AppThunkAction } from '../../stores'

export const enterContest = (contestId: string): AppThunkAction<Contest> => {
  return async (_dispatch, _getState, { contestService }) => {
    const contest = await contestService.getContestByShortId(contestId)
    return contest
  }
}

export const enterUser = (
  contestId: string,
  email: string
): AppThunkAction<boolean> => {
  return async (_dispatch, _getState, { authService }) => {
    return authService.isRegistered(contestId, email)
  }
}
