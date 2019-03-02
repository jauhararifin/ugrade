import { useEffect } from 'react'
import { useMappedState } from 'redux-react-hook'
import { useAppThunkDispatch } from 'ugrade/common'
import { UnsubscriptionFunction } from 'ugrade/services/contest'
import { AppThunkAction } from 'ugrade/store'
import { getScoreboard, setScoreboard } from '../store'

export function subscribeScoreboardAction(): AppThunkAction<
  UnsubscriptionFunction
> {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    const unsub = await contestService.subscribeScoreboard(token, contest => {
      const stillRelevant = getState().auth.token === token
      if (stillRelevant) {
        dispatch(setScoreboard(contest))
      }
    })
    return unsub
  }
}

let alreadyRun = false

export function useScoreboard() {
  const dispatch = useAppThunkDispatch()
  useEffect(() => {
    if (!alreadyRun) {
      alreadyRun = true
      const unsub = dispatch(subscribeScoreboardAction())
      return () => {
        alreadyRun = false
        unsub.then(func => func()).catch(_ => null)
      }
    }
  }, [])

  return useMappedState(getScoreboard)
}
