import { useMappedState } from 'redux-react-hook'
import { globalErrorCatcher, useAppThunkDispatch } from 'ugrade/common'
import { getProblems, Problem, setProblems } from 'ugrade/contest/store'
import { UnsubscriptionFunction } from 'ugrade/services/contest/ContestService'
import { AppThunkAction } from 'ugrade/store'
import { useSingleEffect } from 'ugrade/utils'

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

export const subscribeProblemsAction = (): AppThunkAction<
  UnsubscriptionFunction
> => {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    return contestService.subscribeProblemIds(token, newIds => {
      const stillRelevant = getState().auth.token === token
      if (stillRelevant) {
        dispatch(getProblemByIdsAction(newIds)).catch(globalErrorCatcher)
      }
    })
  }
}

export function useProblems() {
  const dispatch = useAppThunkDispatch()
  useSingleEffect(
    'USE_PROBLEMS',
    () => {
      const subs = dispatch(subscribeProblemsAction())
      return () => {
        subs.then(unsub => unsub()).catch(globalErrorCatcher)
      }
    },
    []
  )

  return useMappedState(getProblems)
}
