import { AppThunkAction } from 'ugrade/store'
import { setSubmissions, Submission } from 'ugrade/stores/Contest'

export const submitSolutionAction = (
  problemId: string,
  languageId: string,
  sourceCode: string
): AppThunkAction<Submission> => {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    const submission = await contestService.submitSolution(
      token,
      problemId,
      languageId,
      sourceCode
    )
    const stillRelevant = token === getState().auth.token
    if (stillRelevant) dispatch(setSubmissions([submission]))
    return submission
  }
}
