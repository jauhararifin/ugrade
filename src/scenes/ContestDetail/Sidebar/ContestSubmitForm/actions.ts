import { SubmissionDetail } from '../../../../services/contest/Submission'
import { AppThunkAction } from '../../../../stores'
import { setCurrentContestSubmissions } from '../../../../stores/Contest/ContestSetCurrentContestSubmissions'

export const submitSolution = (
  contestId: number,
  problemId: number,
  languageId: number,
  sourceCode: string
): AppThunkAction<SubmissionDetail> => {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    const submissionDetail = await contestService.submitContestSolution(
      token,
      contestId,
      problemId,
      languageId,
      sourceCode
    )
    dispatch(setCurrentContestSubmissions(contestId, [submissionDetail]))
    return submissionDetail
  }
}
