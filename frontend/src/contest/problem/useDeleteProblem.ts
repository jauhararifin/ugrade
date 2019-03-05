import { useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/store'
import { deleteProblems } from '../store'

export function deleteProblemAction(problemId: string): AppThunkAction {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    const deleted = await contestService.deleteProblemIds(token, [problemId])
    const stillRelevant = getState().auth.token === token
    if (stillRelevant) {
      dispatch(deleteProblems(deleted))
    }
  }
}

export function useDeleteProblem() {
  const dispatch = useAppThunkDispatch()
  return (problemId: string) => dispatch(deleteProblemAction(problemId))
}
