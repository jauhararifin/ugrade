import { useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/store'
import { ProblemType, setProblems } from '../store'

export function createProblemAction(
  shortId: string,
  name: string,
  statement: string,
  type: ProblemType,
  disabled: boolean,
  timeLimit: number,
  tolerance: number,
  memoryLimit: number,
  outputLimit: number
): AppThunkAction {
  return async (dispatch, getState, { problemService }) => {
    const token = getState().auth.token
    const problem = await problemService.createProblem(
      token,
      shortId,
      name,
      statement,
      type,
      disabled,
      timeLimit,
      tolerance,
      memoryLimit,
      outputLimit
    )
    const stillRelevant = getState().auth.token
    if (stillRelevant) {
      dispatch(setProblems([problem]))
    }
  }
}

export function useCreateProblem() {
  const dispatch = useAppThunkDispatch()
  return (
    shortId: string,
    name: string,
    statement: string,
    type: ProblemType,
    disabled: boolean,
    timeLimit: number,
    tolerance: number,
    memoryLimit: number,
    outputLimit: number
  ) =>
    dispatch(
      createProblemAction(shortId, name, statement, type, disabled, timeLimit, tolerance, memoryLimit, outputLimit)
    )
}
