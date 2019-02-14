import { AppThunkAction } from '../../../stores'
import { Contest } from '../../../stores/Contest'

export const createContestClarification = (
  contest: Contest,
  title: string,
  subject: string,
  content: string
): AppThunkAction<void> => {
  return async (_dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    await contestService.createContestClarification(
      token,
      contest.id,
      title,
      subject,
      content
    )
  }
}
