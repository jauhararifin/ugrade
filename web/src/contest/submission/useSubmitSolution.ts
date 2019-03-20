import { useAppThunkDispatch } from 'ugrade/common'
import { setSubmissions, Submission } from 'ugrade/contest/store'
import { AppThunkAction } from 'ugrade/store'

export const submitSolutionAction = (
  problemId: string,
  languageId: string,
  sourceCode: string
): AppThunkAction<Submission> => {
  return async (dispatch, getState, { submissionService }) => {
    const token = getState().auth.token
    const submission = await submissionService.submitSolution(token, problemId, languageId, sourceCode)
    const stillRelevant = token === getState().auth.token
    if (stillRelevant) dispatch(setSubmissions([submission]))
    return submission
  }
}

export function useSubmitSolution() {
  const dispatch = useAppThunkDispatch()
  return (problemId: string, languageId: string, sourceCode: string) =>
    dispatch(submitSolutionAction(problemId, languageId, sourceCode))
}
