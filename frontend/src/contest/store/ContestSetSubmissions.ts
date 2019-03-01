import { ContestActionType } from './ContestAction'
import { ContestState, Submission } from './ContestState'

export interface ContestSetSubmissions {
  type: ContestActionType.SetSubmissions
  submissions: Submission[]
}

export function setSubmissions(
  submissions: Submission[]
): ContestSetSubmissions {
  return {
    type: ContestActionType.SetSubmissions,
    submissions,
  }
}

export function setSubmissionReducer(
  state: ContestState,
  action: ContestSetSubmissions
): ContestState {
  const nextState = { ...state }
  const nextSubmission = nextState.submissions || {}
  action.submissions
    .slice()
    .forEach(value => (nextSubmission[value.id] = value))
  nextState.submissions = nextSubmission
  return nextState
}
