import { Reducer } from 'redux'
import { Problem } from '../../services/problem'
import {
  ContestActionReadAnnouncements,
  ContestActionSetCurrentContest,
  ContestActionSetCurrentContestAnnouncements,
  ContestActionSetCurrentContestProblems,
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
      return setCurrentContest(state, action as ContestActionSetCurrentContest)

    case ContestActionType.SetCurrentContestAnnouncements:
      return setCurrentContestAnnouncements(
        state,
        action as ContestActionSetCurrentContestAnnouncements
      )

    case ContestActionType.SetCurrentContestProblems:
      return setCurrentContestProblems(
        state,
        action as ContestActionSetCurrentContestProblems
      )

    case ContestActionType.ReadAnnouncements:
      return readAnnouncements(state, action as ContestActionReadAnnouncements)
  }
  return state
}

function setCurrentContest(
  state: ContestState,
  action: ContestActionSetCurrentContest
): ContestState {
  return {
    ...state,
    currentContest: {
      ...action.contest,
      announcements: action.contest.announcements
        ? action.contest.announcements
            .sort((a, b) => b.issuedTime.getTime() - a.issuedTime.getTime())
            .slice()
        : undefined,
    },
  }
}

function setCurrentContestAnnouncements(
  state: ContestState,
  action: ContestActionSetCurrentContestAnnouncements
): ContestState {
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

function setCurrentContestProblems(
  state: ContestState,
  action: ContestActionSetCurrentContestProblems
): ContestState {
  const currentContest = state.currentContest
  if (currentContest && currentContest.id === action.contestId) {
    if (!currentContest.problems) currentContest.problems = []

    const contestIdProblem: { [id: number]: Problem } = {}
    currentContest.problems
      .slice()
      .forEach(value => (contestIdProblem[value.id] = value))

    const newProblems = action.problems
    newProblems.slice().forEach(value => (contestIdProblem[value.id] = value))

    const order = action.problemOrder.slice()
    const result = order
      .map(problemId => contestIdProblem[problemId])
      .filter(problem => problem)

    return {
      ...state,
      currentContest: {
        ...currentContest,
        problems: result,
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
