import { useMappedState } from 'redux-react-hook'
import { useAppThunkDispatch } from 'ugrade/common'
import { UnsubscriptionFunction } from 'ugrade/services/contest/ContestService'
import { AppThunkAction } from 'ugrade/store'
import { useSingleEffect } from 'ugrade/utils'
import { getSubmissions, setSubmissions } from '../store'

export const subscribeSubmissionsAction = (): AppThunkAction<
  UnsubscriptionFunction
> => {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    return contestService.subscribeSubmissions(token, newSubmissions => {
      const stillRelevant = getState().auth.token === token
      if (stillRelevant) dispatch(setSubmissions(newSubmissions))
    })
  }
}

export function useSubmissions() {
  const dispatch = useAppThunkDispatch()
  useSingleEffect(
    'USE_SUBMISSIONS',
    () => {
      const subs = dispatch(subscribeSubmissionsAction())
      return () => {
        subs.then(unsub => unsub()).catch(_ => null)
      }
    },
    []
  )

  return useMappedState(getSubmissions)
}
