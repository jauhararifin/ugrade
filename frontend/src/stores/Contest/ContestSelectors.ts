import { AppState } from '../state'
import {
  Announcement,
  Clarification,
  Problem,
  Submission,
} from './ContestState'

export function getProblemList(state: AppState): Problem[] | undefined {
  const problems = state.contest.problems
  if (problems) {
    return Object.keys(problems)
      .map(k => problems[k])
      .sort((a, b) => a.order - b.order)
  }
  return undefined
}

export function getAnnouncementList(
  state: AppState
): Announcement[] | undefined {
  const announcements = state.contest.announcements
  if (announcements) {
    return Object.keys(announcements)
      .map(k => announcements[k])
      .sort((a, b) => a.issuedTime.getTime() - b.issuedTime.getTime())
  }
  return undefined
}

export function getClarificationList(
  state: AppState
): Clarification[] | undefined {
  const clarifications = state.contest.clarifications
  if (clarifications) {
    return Object.keys(clarifications)
      .map(k => clarifications[k])
      .sort((a, b) => a.issuedTime.getTime() - b.issuedTime.getTime())
  }
  return undefined
}

export function getSubmissionList(state: AppState): Submission[] | undefined {
  const submissions = state.contest.submissions
  if (submissions) {
    return Object.keys(submissions)
      .map(k => submissions[k])
      .sort((a, b) => a.issuedTime.getTime() - b.issuedTime.getTime())
  }
  return undefined
}
