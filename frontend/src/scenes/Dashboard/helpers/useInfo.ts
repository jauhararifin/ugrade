import { useState } from 'react'

import { AppThunkAction, AppThunkDispatch } from '../../../stores'
import { ContestInfo, setInfo } from '../../../stores/Contest'

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
  const [started, setStarted] = useState(false)
  if (!started) {
    setStarted(true)
    await dispatch(getMyContestAction())
  }
}
