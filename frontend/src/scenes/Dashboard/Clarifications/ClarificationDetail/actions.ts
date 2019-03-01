import { setClarifications } from 'ugrade/contest/store/ContestSetClarrifications'
import { AppThunkAction } from 'ugrade/store'
import { normalizeClarification } from '../util'

export const readClarificationEntriesAction = (
  clarificationId: string,
  entryIds: string[]
): AppThunkAction<void> => {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    const clarification = await contestService.readClarificationEntries(
      token,
      clarificationId,
      entryIds
    )
    const clarif = normalizeClarification(clarification)
    const stillRelevant = getState().auth.token === token
    if (stillRelevant) dispatch(setClarifications([clarif]))
  }
}
