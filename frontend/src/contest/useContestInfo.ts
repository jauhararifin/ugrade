import { useEffect } from 'react'
import { useMappedState } from 'redux-react-hook'
import { useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/store'
import { getContestInfo, setInfo } from './store'

export function getContestInfoAction(): AppThunkAction {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    if (token.length > 0) {
      const contestInfo = await contestService.getMyContest(token)
      const stillRelevant = getState().auth.token === token
      if (stillRelevant) {
        dispatch(setInfo(contestInfo))
      }
    }
  }
}

export function useContestInfo() {
  const dispatch = useAppThunkDispatch()
  useEffect(() => {
    let cancel = false
    ;(async () => {
      while (!cancel) {
        try {
          await dispatch(getContestInfoAction())
          break
        } catch (error) {
          await new Promise(r => setTimeout(r, 5000))
        }
      }
    })().catch(_ => null)
    return () => {
      cancel = true
    }
  }, [])
  return useMappedState(getContestInfo)
}
