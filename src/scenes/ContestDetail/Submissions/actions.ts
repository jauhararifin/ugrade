import {
  SubmissionSubscribeCallback,
  SubmissionUnsubscribeFunction,
} from '../../../services/contest/ContestService'
import { AppThunkAction } from '../../../stores'
import { Contest, Submission } from '../../../stores/Contest'
import { setCurrentContestSubmissions } from '../../../stores/Contest/ContestSetCurrentContestSubmissions'

export const getContestSubmissions = (
  contestId: number
): AppThunkAction<Submission[]> => {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    const submissions = await contestService.getContestSubmissions(
      token,
      contestId
    )
    dispatch(setCurrentContestSubmissions(contestId, submissions))
    return submissions
  }
}

export const subscribeContestSubmissions = (
  contest: Contest,
  callback: SubmissionSubscribeCallback
): AppThunkAction<SubmissionUnsubscribeFunction> => {
  return async (_dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    return contestService.subscribeContestSubmissions(
      token,
      contest.id,
      callback
    )
  }
}
