import { useMappedState } from 'redux-react-hook'
import { useAppThunkDispatch } from 'ugrade/common'
import { UnsubscriptionFunction } from 'ugrade/services/contest'
import { AppThunkAction } from 'ugrade/store'
import { useSingleEffect } from 'ugrade/utils'
import { getScoreboard, setScoreboard } from '../store'

export function subscribeScoreboardAction(): AppThunkAction<
  UnsubscriptionFunction
> {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    const unsub = contestService.subscribeScoreboard(token, contest => {
      const stillRelevant = getState().auth.token === token
      if (stillRelevant) {
        dispatch(setScoreboard(contest))
      }
    })
    return unsub
  }
}

export function useScoreboard() {
  const dispatch = useAppThunkDispatch()
  useSingleEffect(
    'USE_SCOREBOARD',
    () => {
      const unsub = dispatch(subscribeScoreboardAction())
      return () => {
        unsub.then(func => func()).catch(_ => null)
      }
    },
    []
  )

  return useMappedState(getScoreboard)
}
