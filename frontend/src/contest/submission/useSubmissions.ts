import { useEffect } from 'react'
import { useMappedState } from 'redux-react-hook'
import { useAppThunkDispatch } from 'ugrade/common'
import {
  SubscriptionCallback,
  UnsubscriptionFunction,
} from 'ugrade/services/contest/ContestService'
import { AppThunkAction } from 'ugrade/store'
import { getSubmissions, setSubmissions, Submission } from '../store'

export const getSubmissionsAction = (): AppThunkAction<Submission[]> => {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    const submissions = await contestService.getSubmissions(token)
    const stillRelevant = getState().auth.token === token
    if (stillRelevant) dispatch(setSubmissions(submissions))
    return submissions
  }
}

export const subscribeSubmissionsAction = (
  callback: SubscriptionCallback<Submission[]>
): AppThunkAction<UnsubscriptionFunction> => {
  return async (_dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    return contestService.subscribeSubmissions(token, callback)
  }
}

export function useSubmissions() {
  const dispatch = useAppThunkDispatch()

  useEffect(() => {
    const subs = dispatch(
      subscribeSubmissionsAction(newSubmissions => {
        dispatch(setSubmissions(newSubmissions))
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
          await dispatch(getSubmissionsAction())
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

  return useMappedState(getSubmissions)
}
