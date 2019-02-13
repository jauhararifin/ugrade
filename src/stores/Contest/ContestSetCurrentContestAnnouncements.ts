import { ContestActionType } from './ContestAction'
import { Announcement, Contest, ContestState } from './ContestState'

export interface ContestSetCurrentContestAnnouncements {
  type: ContestActionType.SetCurrentContestAnnouncements
  contestId: number
  announcements: Announcement[]
}

export function setCurrentContestAnnouncements(
  contest: number | Contest,
  announcements: Announcement[]
) {
  return {
    type: ContestActionType.SetCurrentContestAnnouncements,
    contestId: typeof contest === 'number' ? contest : contest.id,
    announcements,
  }
}

export function setCurrentContestAnnouncementsReducer(
  state: ContestState,
  action: ContestSetCurrentContestAnnouncements
) {
  const currentContest = state.currentContest
  if (currentContest && currentContest.id === action.contestId) {
    if (!currentContest.announcements) currentContest.announcements = []

    const contestIdAccouncement: { [id: number]: Announcement } = {}
    currentContest.announcements
      .slice()
      .forEach(value => (contestIdAccouncement[value.id] = value))

    const newAnnouncements = action.announcements
    newAnnouncements
      .slice()
      .forEach(value => (contestIdAccouncement[value.id] = value))

    const result = Object.values(contestIdAccouncement).sort(
      (a, b) => b.issuedTime.getTime() - a.issuedTime.getTime()
    )

    return {
      ...state,
      currentContest: {
        ...currentContest,
        announcements: result,
      },
    }
  }
  return { ...state }
}
