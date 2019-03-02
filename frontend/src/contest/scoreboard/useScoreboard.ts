import { useEffect } from 'react'
import { useMappedState } from 'redux-react-hook'
import { useAppThunkDispatch } from 'ugrade/common'
import { Scoreboard } from 'ugrade/services/contest'
import { AppThunkAction } from 'ugrade/store'
import { getScoreboard, setScoreboard } from '../store'

export function getScoreboardAction(): AppThunkAction<Scoreboard> {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    const scoreboard = await contestService.getScoreboard(token)
    const stillRelevant = getState().auth.token === token
    if (stillRelevant) dispatch(setScoreboard(scoreboard))
    return scoreboard
  }
}

export function useScoreboard() {
  const dispatch = useAppThunkDispatch()

  useEffect(() => {
    let cancel = false
    const func = async () => {
      while (!cancel) {
        try {
          await dispatch(getScoreboardAction())
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

  return useMappedState(getScoreboard)
}
