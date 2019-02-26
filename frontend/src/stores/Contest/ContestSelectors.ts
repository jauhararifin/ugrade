import { AppState } from '../state'
import { Announcement, Problem } from './ContestState'

export function getProblemList(state: AppState): Problem[] | undefined {
  const problems = state.contest.problems
  if (problems) return Object.keys(problems).map(k => problems[k])
  return undefined
}

export function getAnnouncementList(
  state: AppState
): Announcement[] | undefined {
  const announcements = state.contest.announcements
  if (announcements) {
    return Object.keys(announcements).map(k => announcements[k])
  }
  return undefined
}
