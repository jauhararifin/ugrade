import { ContestActionType } from './ContestAction'
import { Announcement, ContestState } from './ContestState'

export interface ContestSetAnnouncements {
  type: ContestActionType.SetAnnouncements
  announcements: Announcement[]
}

export function setAnnouncements(
  announcements: Announcement[]
): ContestSetAnnouncements {
  return {
    type: ContestActionType.SetAnnouncements,
    announcements,
  }
}

export function setAnnouncementsReducer(
  state: ContestState,
  action: ContestSetAnnouncements
): ContestState {
  const nextState = { ...state }
  const oldAnnouncements = nextState.announcements || {}
  const newAnnouncements: { [annoucementId: string]: Announcement } = {}
  action.announcements
    .slice()
    .forEach(value => (newAnnouncements[value.id] = value))
  return {
    ...state,
    announcements: { ...oldAnnouncements, ...newAnnouncements },
  }
}
