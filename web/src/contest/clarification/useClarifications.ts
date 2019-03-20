import { useMappedState } from 'redux-react-hook'
import { globalErrorCatcher, useAppThunkDispatch } from 'ugrade/common'
import { getClarifications } from 'ugrade/contest/store'
import { setClarifications } from 'ugrade/contest/store/ContestSetClarrifications'
import { ClarificationsUnsubscribe } from 'ugrade/services/clarification'
import { AppThunkAction } from 'ugrade/store'
import { useSingleEffect } from 'ugrade/utils'
import { normalizeClarification } from './util'

export const subscribeClarificationsAction = (): AppThunkAction<ClarificationsUnsubscribe> => {
  return async (dispatch, getState, { clarificationService }) => {
    const token = getState().auth.token
    return clarificationService.subscribeClarifications(token, items => {
      const stillRelevant = getState().auth.token === token
      if (stillRelevant) {
        const normalized = items.map(normalizeClarification)
        dispatch(setClarifications(normalized))
      }
    })
  }
}

export function useClarifications() {
  const dispatch = useAppThunkDispatch()

  useSingleEffect(
    'USE_CLARIFICATION',
    () => {
      const subs = dispatch(subscribeClarificationsAction())
      return () => {
        subs.then(unsub => unsub()).catch(globalErrorCatcher)
      }
    },
    []
  )

  return useMappedState(getClarifications)
}
