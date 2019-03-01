import { ContestActionType } from './ContestAction'
import { Announcement, ContestState } from './ContestState'

export interface ContestReadAnnouncements {
  type: ContestActionType.ReadAnnouncements
  announcements: string[]
}

export function readAnnouncements(
  announcements: string[]
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
  const nextState = { ...state }
  const announcements: { [id: string]: Announcement } =
    nextState.announcements || {}
  action.announcements.forEach(id => {
    if (announcements[id]) announcements[id].read = true
  })
  return {
    ...nextState,
    announcements,
  }
}
