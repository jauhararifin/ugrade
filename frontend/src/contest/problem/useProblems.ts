import { useEffect } from 'react'
import { useMappedState } from 'redux-react-hook'
import { useAppThunkDispatch } from 'ugrade/common'
import { getProblems, Problem, setProblems } from 'ugrade/contest/store'
import {
  SubscriptionCallback,
  UnsubscriptionFunction,
} from 'ugrade/services/contest/ContestService'
import { AppThunkAction } from 'ugrade/store'

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
      await dispatch(getProblemByIdsAction(problemIds))
    }
  }
}

export const subscribeProblemIdsAction = (
  callback: SubscriptionCallback<string[]>
): AppThunkAction<UnsubscriptionFunction> => {
  return async (_dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    return contestService.subscribeProblemIds(token, callback)
  }
}

let alreadyRun = false

export function useProblems() {
  const dispatch = useAppThunkDispatch()

  useEffect(() => {
    if (!alreadyRun) {
      alreadyRun = true
      const subs = dispatch(
        subscribeProblemIdsAction(async newIds => {
          const newProbs = await dispatch(getProblemByIdsAction(newIds))
          dispatch(setProblems(newProbs))
        })
      )
      return () => {
        alreadyRun = false
        subs.then(unsub => unsub()).catch(_ => null)
      }
    }
  }, [])

  return useMappedState(getProblems)
}
