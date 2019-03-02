import { useEffect } from 'react'
import { useMappedState } from 'redux-react-hook'
import { useAppThunkDispatch } from 'ugrade/common'
import { UnsubscriptionFunction } from 'ugrade/services/contest'
import { AppThunkAction } from 'ugrade/store'
import { getContestInfo, setInfo } from './store'

export function subscribeContestInfoAction(): AppThunkAction<
  UnsubscriptionFunction
> {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    const unsub = await contestService.subscribeMyContest(token, contest => {
      const stillRelevant = getState().auth.token === token
      if (stillRelevant) {
        dispatch(setInfo(contest))
      }
    })
    return unsub
  }
}

let alreadyRun = false

export function useContestInfo() {
  const dispatch = useAppThunkDispatch()
  useEffect(() => {
    if (!alreadyRun) {
      alreadyRun = true
      const unsub = dispatch(subscribeContestInfoAction())
      return () => {
        alreadyRun = false
        unsub.then(func => func()).catch(_ => null)
      }
    }
  }, [])

  return useMappedState(getContestInfo)
}
