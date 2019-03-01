import { useEffect } from 'react'
import {
  ClarificationSubscribeCallback,
  ClarificationUnsubscribeFunction,
} from 'ugrade/services/contest/ContestService'
import { AppThunkAction, AppThunkDispatch } from 'ugrade/store'
import { Clarification } from 'ugrade/stores/Contest'
import { setClarifications } from 'ugrade/stores/Contest/ContestSetClarrifications'
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

  useEffect(() => {
    dispatch(getClarificationsAction())
  }, [])
}
