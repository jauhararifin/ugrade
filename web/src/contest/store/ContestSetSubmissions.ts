import { ContestActionType } from './ContestAction'
import { ContestState, Submission } from './ContestState'

export interface ContestSetSubmissions {
  type: ContestActionType.SetSubmissions
  submissions: Submission[]
}

export function setSubmissions(submissions: Submission[]): ContestSetSubmissions {
  return {
    type: ContestActionType.SetSubmissions,
    submissions,
  }
}

export function setSubmissionReducer(state: ContestState, action: ContestSetSubmissions): ContestState {
  const nextSubmission: { [id: string]: Submission } = {}
  action.submissions.slice().forEach(value => (nextSubmission[value.id] = value))
  return { ...state, submissions: { ...state.submissions, ...nextSubmission } }
}
