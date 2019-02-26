import { useState } from 'react'

import { AppThunkAction, AppThunkDispatch } from '../../../stores'
import { Problem, setProblems } from '../../../stores/Contest'

export const getProblemsAction = (): AppThunkAction<Problem[]> => {
  return async (dispatch, getState, { problemService, contestService }) => {
    const token = getState().auth.token
    const problemIds = await contestService.getProblemIds(token)
    const problems = await problemService.getProblemByIds(token, problemIds)
    const result = problems.map(
      (prob): Problem => ({
        ...prob,
        order: problemIds.indexOf(prob.id),
      })
    )
    const stillRelevant = getState().auth.token === token
    if (stillRelevant) {
      dispatch(setProblems(result))
    }
    return result
  }
}

export async function useProblems(dispatch: AppThunkDispatch) {
  const [started, setStarted] = useState(false)
  if (!started) {
    setStarted(true)
    await dispatch(getProblemsAction())
  }
}
