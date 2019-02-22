import { ContestActionType } from './ContestAction'
import { ContestState } from './ContestState'

export interface ContestReadAnnouncements {
  type: ContestActionType.ReadAnnouncements
  announcements: number[]
}

export function readAnnouncements(
  announcements: number[]
): ContestReadAnnouncements {
  return {
    type: ContestActionType.ReadAnnouncements,
    announcements,
  }
}

export function readAnnouncementsReducer(
  state: ContestState,
  action: ContestReadAnnouncements
): ContestState {
  const currentContest = state.currentContest
  if (currentContest) {
    if (!currentContest.announcements) currentContest.announcements = []
    const announcements = currentContest.announcements.slice().map(item => ({
      ...item,
      read: action.announcements.includes(item.id) ? true : item.read,
    }))

    return {
      ...state,
      currentContest: {
        ...currentContest,
        announcements,
      },
    }
  }
  return { ...state }
}
