import { AppThunkAction } from '../../../../../stores'
import { setCurrentContestClarrifications } from '../../../../../stores/Contest/ContestSetCurrentContestClarrifications'

export const createClarificationEntry = (
  contestId: number,
  clarificationId: number,
  content: string
): AppThunkAction<void> => {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    const clarif = await contestService.createContestClarificationEntry(
      token,
      contestId,
      clarificationId,
      content
    )
    dispatch(setCurrentContestClarrifications(contestId, [clarif]))
  }
}
