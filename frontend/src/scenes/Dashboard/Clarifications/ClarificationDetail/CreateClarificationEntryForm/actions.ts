import { setClarifications } from 'ugrade/contest/store/ContestSetClarrifications'
import { AppThunkAction } from 'ugrade/store'
import { normalizeClarification } from '../../util'

export const createClarificationEntryAction = (
  clarificationId: string,
  content: string
): AppThunkAction<void> => {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    const clarification = await contestService.createClarificationEntry(
      token,
      clarificationId,
      content
    )
    const clarif = normalizeClarification(clarification)
    const stillRelevant = getState().auth.token === token
    if (stillRelevant) dispatch(setClarifications([clarif]))
  }
}
