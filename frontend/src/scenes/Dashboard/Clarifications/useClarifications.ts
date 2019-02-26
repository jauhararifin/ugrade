import { useState } from 'react'

import { AppThunkAction, AppThunkDispatch } from '../../../stores'
import { Clarification, ClarificationEntry } from '../../../stores/Contest'
import { setClarifications } from '../../../stores/Contest/ContestSetClarrifications'
import { normalizeClarification } from './util'

export const getClarificationsAction = (): AppThunkAction<Clarification[]> => {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    const clarifications = await contestService.getClarifications(token)
    const clarifs = clarifications.map(normalizeClarification)
    const stillRelevant = getState().auth.token === token
    if (stillRelevant) dispatch(setClarifications(clarifs))
    return clarifs
  }
}

export async function useClarifications(dispatch: AppThunkDispatch) {
  const [started, setStarted] = useState(false)
  if (!started) {
    setStarted(true)
    await dispatch(getClarificationsAction())
  }
}
