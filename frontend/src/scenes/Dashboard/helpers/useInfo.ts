import { useEffect } from 'react'
import { ContestInfo, setInfo } from 'ugrade/contest/store'
import { AppThunkAction, AppThunkDispatch } from 'ugrade/store'

export const getMyContestAction = (): AppThunkAction<ContestInfo> => {
  return async (dispatch, getState, { contestService }) => {
    const contest = getState().contest.info
    if (!contest) {
      const token = getState().auth.token
      const myContest = await contestService.getMyContest(token)
      const stillRelevant = getState().auth.token === token
      if (stillRelevant) dispatch(setInfo(myContest))
      return myContest
    }
    return contest
  }
}

export async function useInfo(dispatch: AppThunkDispatch) {
  useEffect(() => {
    dispatch(getMyContestAction())
  }, [])
}
