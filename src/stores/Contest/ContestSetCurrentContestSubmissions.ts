import { ContestActionType } from './ContestAction'
import { Contest, ContestState, Submission } from './ContestState'

export interface ContestSetCurrentContestSubmissions {
  type: ContestActionType.SetCurrentContestSubmissions
  contestId: number
  submissions: Submission[]
}

export function setCurrentContestSubmissions(
  contest: number | Contest,
  submissions: Submission[]
): ContestSetCurrentContestSubmissions {
  return {
    type: ContestActionType.SetCurrentContestSubmissions,
    contestId: typeof contest === 'number' ? contest : contest.id,
    submissions,
  }
}

export function setCurrentContestSubmissionReducer(
  state: ContestState,
  action: ContestSetCurrentContestSubmissions
): ContestState {
  const currentContest = state.currentContest
  if (currentContest && currentContest.id === action.contestId) {
    if (!currentContest.submissions) currentContest.submissions = []

    const contestIdSubmission: { [id: number]: Submission } = {}
    currentContest.submissions
      .slice()
      .forEach(value => (contestIdSubmission[value.id] = value))

    const newSubmissions = action.submissions
    newSubmissions
      .slice()
      .forEach(value => (contestIdSubmission[value.id] = value))

    const result = Object.values(newSubmissions).sort(
      (a, b) => a.issuedTime.getTime() - b.issuedTime.getTime()
    )

    return {
      ...state,
      currentContest: {
        ...currentContest,
        submissions: result,
      },
    }
  }
  return { ...state }
}
