import { useEffect, useState } from 'react'

import {
  ClarificationSubscribeCallback,
  ClarificationUnsubscribeFunction,
} from '../../../services/contest/ContestService'
import { AppThunkAction, AppThunkDispatch } from '../../../stores'
import { Clarification } from '../../../stores/Contest'
import { setClarifications } from '../../../stores/Contest/ContestSetClarrifications'
import { normalizeClarification } from '../Clarifications/util'

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

export const subscribeClarificationsAction = (
  callback: ClarificationSubscribeCallback
): AppThunkAction<ClarificationUnsubscribeFunction> => {
  return async (_dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    return contestService.subscribeClarifications(token, callback)
  }
}

export async function useClarifications(dispatch: AppThunkDispatch) {
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const subs = dispatch(
      subscribeClarificationsAction(newClarifs => {
        const clarifs = newClarifs.map(normalizeClarification)
        dispatch(setClarifications(clarifs))
      })
    )
    return () => {
      subs.then(unsub => {
        unsub()
      })
    }
  }, [])

  if (!started) {
    setStarted(true)
    await dispatch(getClarificationsAction())
  }
}
