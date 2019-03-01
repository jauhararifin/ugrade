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
    dispatch(getContestInfoAction())
  }, [])
  return useMappedState(getContestInfo)
}
