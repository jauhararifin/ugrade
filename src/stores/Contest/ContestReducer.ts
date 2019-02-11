import { Reducer } from 'redux'
import {
  ContestActionReadAnnouncements,
  ContestActionSetCurrentContestAnnouncements,
  ContestActionType,
} from './ContestAction'
import { Announcement, ContestState, initialValue } from './ContestState'

export const contestReducer: Reducer<ContestState> = (
  state: ContestState = initialValue,
  action
): ContestState => {
  switch (action.type) {
    case ContestActionType.SetContests:
      return {
        ...state,
        contests: action.contests,
      }

    case ContestActionType.SetCurrentContest:
      return {
        ...state,
        currentContest: action.contest,
      }

    case ContestActionType.SetCurrentContestAnnouncements:
      return setCurrentContestAnnouncements(
        state,
        action as ContestActionSetCurrentContestAnnouncements
      )

    case ContestActionType.ReadAnnouncements:
      return readAnnouncements(state, action as ContestActionReadAnnouncements)
  }
  return state
}

function setCurrentContestAnnouncements(
  state: ContestState,
  action: ContestActionSetCurrentContestAnnouncements
): ContestState {
  const currentContest = state.currentContest
  if (currentContest) {
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

function readAnnouncements(
  state: ContestState,
  action: ContestActionReadAnnouncements
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
