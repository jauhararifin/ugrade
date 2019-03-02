import { useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/store'
import { setClarifications } from '../store/ContestSetClarrifications'
import { normalizeClarification } from './util'

export const readClarificationEntriesAction = (
  clarificationId: string,
  entryIds: string[]
): AppThunkAction => {
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

export function useReadClarificationEntries() {
  const dispatch = useAppThunkDispatch()
  return (clarificationId: string, entryIds: string[]) =>
    dispatch(readClarificationEntriesAction(clarificationId, entryIds))
}
