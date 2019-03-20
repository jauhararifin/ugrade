import { useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/store'
import { setClarifications } from '../store/ContestSetClarrifications'
import { normalizeClarification } from './util'

export const createClarificationAction = (title: string, subject: string, content: string): AppThunkAction => {
  return async (dispatch, getState, { clarificationService }) => {
    const token = getState().auth.token
    const clarification = await clarificationService.createClarification(token, title, subject, content)
    const clarif = normalizeClarification(clarification)
    const stillRelevant = getState().auth.token === token
    if (stillRelevant) dispatch(setClarifications([clarif]))
  }
}

export function useCreateClarification() {
  const dispatch = useAppThunkDispatch()
  return (title: string, subject: string, content: string) =>
    dispatch(createClarificationAction(title, subject, content))
}
