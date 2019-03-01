import { useEffect } from 'react'
import { Problem, setProblems } from 'ugrade/contest/store'
import {
  ProblemIdsSubscribeCallback,
  ProblemIdsUnsubscribeFunction,
} from 'ugrade/services/contest/ContestService'
import { AppThunkAction, AppThunkDispatch } from 'ugrade/store'

export const getProblemByIdsAction = (
  ids: string[]
): AppThunkAction<Problem[]> => {
  return async (dispatch, getState, { problemService }) => {
    const token = getState().auth.token
    const problems = await problemService.getProblemByIds(token, ids)
    const result = problems.map(
      (prob): Problem => ({
        ...prob,
        order: ids.indexOf(prob.id),
      })
    )
    const stillRelevant = getState().auth.token === token
    if (stillRelevant) {
      dispatch(setProblems(result))
    }
    return result
  }
}

export const getProblemsAction = (): AppThunkAction => {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    const problemIds = await contestService.getProblemIds(token)
    const stillRelevant = getState().auth.token === token
    if (stillRelevant) {
      dispatch(getProblemByIdsAction(problemIds))
    }
  }
}

export const subscribeProblemIdsAction = (
  callback: ProblemIdsSubscribeCallback
): AppThunkAction<ProblemIdsUnsubscribeFunction> => {
  return async (_dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    return contestService.subscribeProblemIds(token, callback)
  }
}

export async function useProblems(dispatch: AppThunkDispatch) {
  useEffect(() => {
    const subs = dispatch(
      subscribeProblemIdsAction(newIds => {
        dispatch(getProblemByIdsAction(newIds))
      })
    )
    return () => {
      subs.then(unsub => {
        unsub()
      })
    }
  }, [])

  useEffect(() => {
    dispatch(getProblemsAction())
  }, [])
}
