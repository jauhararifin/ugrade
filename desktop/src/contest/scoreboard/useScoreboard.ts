import { useMappedState } from 'redux-react-hook'
import { globalErrorCatcher, useAppThunkDispatch } from 'ugrade/common'
import { UnsubscriptionFunction } from 'ugrade/services/contest'
import { AppThunkAction } from 'ugrade/store'
import { useSingleEffect } from 'ugrade/utils'
import { getScoreboard, setScoreboard } from '../store'

export function subscribeScoreboardAction(): AppThunkAction<
  UnsubscriptionFunction
> {
  return async (dispatch, getState, { scoreboardService }) => {
    const token = getState().auth.token
    const unsub = scoreboardService.subscribeScoreboard(token, scoreboard => {
      const stillRelevant = getState().auth.token === token
      if (stillRelevant) {
        dispatch(setScoreboard(scoreboard))
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
        unsub.then(func => func()).catch(globalErrorCatcher)
      }
    },
    []
  )

  return useMappedState(getScoreboard)
}
