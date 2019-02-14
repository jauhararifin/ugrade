import { AppThunkAction } from '../../../../stores'
import { setCurrentContestClarrifications } from '../../../../stores/Contest/ContestSetCurrentContestClarrifications'

export const readClarificationEntries = (
  contestId: number,
  clarificationId: number,
  entryIds: number[]
): AppThunkAction<void> => {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    const clarification = await contestService.readContestClarificationEntries(
      token,
      contestId,
      clarificationId,
      entryIds
    )
    dispatch(setCurrentContestClarrifications(contestId, [clarification]))
  }
}
