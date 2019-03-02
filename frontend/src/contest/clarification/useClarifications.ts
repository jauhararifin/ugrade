import { useEffect } from 'react'
import { useMappedState } from 'redux-react-hook'
import { useAppThunkDispatch } from 'ugrade/common'
import { Clarification, getClarifications } from 'ugrade/contest/store'
import { setClarifications } from 'ugrade/contest/store/ContestSetClarrifications'
import {
  SubscriptionCallback,
  UnsubscriptionFunction,
} from 'ugrade/services/contest/ContestService'
import { AppThunkAction } from 'ugrade/store'
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

export const subscribeClarificationsAction = (
  callback: SubscriptionCallback<Clarification[]>
): AppThunkAction<UnsubscriptionFunction> => {
  return async (_dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    return contestService.subscribeClarifications(token, items =>
      callback(items.map(normalizeClarification))
    )
  }
}

export function useClarifications() {
  const dispatch = useAppThunkDispatch()

  useEffect(() => {
    const subs = dispatch(
      subscribeClarificationsAction(newClarifs => {
        dispatch(setClarifications(newClarifs))
      })
    )
    return () => {
      subs.then(unsub => unsub()).catch(_ => null)
    }
  }, [])

  useEffect(() => {
    let cancel = false
    const func = async () => {
      while (!cancel) {
        try {
          await dispatch(getClarificationsAction())
          break
        } catch (error) {
          await new Promise(r => setTimeout(r, 5000))
        }
      }
    }
    func().catch(_ => null)
    return () => {
      cancel = true
    }
  }, [])

  return useMappedState(getClarifications)
}
