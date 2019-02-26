import { AppThunkAction } from '../../../../../stores'
import { setClarifications } from '../../../../../stores/Contest/ContestSetClarrifications'
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
