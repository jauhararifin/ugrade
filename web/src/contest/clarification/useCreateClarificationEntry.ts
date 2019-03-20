import { useAppThunkDispatch } from 'ugrade/common'
import { setClarifications } from 'ugrade/contest/store/ContestSetClarrifications'
import { AppThunkAction } from 'ugrade/store'
import { normalizeClarification } from './util'

export const createClarificationEntryAction = (clarificationId: string, content: string): AppThunkAction<void> => {
  return async (dispatch, getState, { clarificationService }) => {
    const token = getState().auth.token
    const clarification = await clarificationService.createClarificationEntry(token, clarificationId, content)
    const clarif = normalizeClarification(clarification)
    const stillRelevant = getState().auth.token === token
    if (stillRelevant) dispatch(setClarifications([clarif]))
  }
}

export function useCreateClarificationEntry() {
  const dispatch = useAppThunkDispatch()
  return (clarificationId: string, content: string) =>
    dispatch(createClarificationEntryAction(clarificationId, content))
}
