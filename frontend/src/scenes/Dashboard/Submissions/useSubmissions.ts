import { useState } from 'react'

import { AppThunkAction, AppThunkDispatch } from 'ugrade/store'
import { setSubmissions, Submission } from 'ugrade/stores/Contest'

export const getSubmissionsAction = (): AppThunkAction<Submission[]> => {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    const submissions = await contestService.getSubmissions(token)
    const stillRelevant = getState().auth.token === token
    if (stillRelevant) dispatch(setSubmissions(submissions))
    return submissions
  }
}

export async function useSubmissions(dispatch: AppThunkDispatch) {
  const [started, setStarted] = useState(false)
  if (!started) {
    setStarted(true)
    await dispatch(getSubmissionsAction())
  }
}
