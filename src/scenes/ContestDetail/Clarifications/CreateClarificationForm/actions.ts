import { AppThunkAction } from '../../../../stores'
import { Contest } from '../../../../stores/Contest'
import { setCurrentContestClarrifications } from '../../../../stores/Contest/ContestSetCurrentContestClarrifications'

export const createContestClarification = (
  contest: Contest,
  title: string,
  subject: string,
  content: string
): AppThunkAction<void> => {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    const clarification = await contestService.createContestClarification(
      token,
      contest.id,
      title,
      subject,
      content
    )
    dispatch(setCurrentContestClarrifications(contest.id, [clarification]))
  }
}
