import { useMappedState } from 'redux-react-hook'
import { globalErrorCatcher, useAppThunkDispatch } from 'ugrade/common'
import { getProblems, setProblems } from 'ugrade/contest/store'
import { UnsubscriptionFunction } from 'ugrade/services/contest/ContestService'
import { AppThunkAction } from 'ugrade/store'
import { useSingleEffect } from 'ugrade/utils'

export const subscribeProblemsAction = (): AppThunkAction<UnsubscriptionFunction> => {
  return async (dispatch, getState, { problemService }) => {
    const token = getState().auth.token
    return problemService.subscribeProblems(token, newProblems => {
      const stillRelevant = getState().auth.token === token
      if (stillRelevant) {
        dispatch(setProblems(newProblems))
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
