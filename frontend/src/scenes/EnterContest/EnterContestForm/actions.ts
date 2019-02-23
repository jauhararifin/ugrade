import { AppThunkAction } from '../../../stores'
import { setContest } from '../../../stores/Contest'

export const enterContest = (contestId: string): AppThunkAction<void> => {
  return async (dispatch, _getState, { contestService }) => {
    const contest = await contestService.getContestByShortId(contestId)
    dispatch(setContest(contest.id, contest.shortId, contest))
  }
}
