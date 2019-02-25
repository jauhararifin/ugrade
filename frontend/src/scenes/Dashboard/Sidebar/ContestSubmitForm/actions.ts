import { AppThunkAction } from '../../../../stores'
import { setSubmissions, Submission } from '../../../../stores/Contest'

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
    dispatch(setSubmissions([submission]))
    return submission
  }
}
