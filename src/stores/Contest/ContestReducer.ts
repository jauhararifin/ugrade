import { Reducer } from 'redux'
import { ContestActionType } from './ContestAction'
import {
  ContestReadAnnouncements,
  readAnnouncementsReducer,
} from './ContestReadAnnouncements'
import { ContestSetContests, setContestsReducer } from './ContestSetContests'
import {
  ContestSetCurrentContest,
  setCurrentContestReducer,
} from './ContestSetCurrentContest'
import {
  ContestSetCurrentContestAnnouncements,
  setCurrentContestAnnouncementsReducer,
} from './ContestSetCurrentContestAnnouncements'
import {
  ContestSetCurrentContestCurrentProblem,
  setCurrentContestCurrentProblemReducer,
} from './ContestSetCurrentContestCurrentProblem'
import {
  ContestSetCurrentContestProblems,
  setCurrentContestProblemsReducer,
} from './ContestSetCurrentContestProblems'
import { ContestState, initialValue } from './ContestState'
import {
  ContestUnsetCurrentContest,
  unsetCurrentContestReducer,
} from './ContestUnsetCurrentContest'

export const contestReducer: Reducer<ContestState> = (
  state: ContestState = initialValue,
  action
): ContestState => {
  switch (action.type) {
    case ContestActionType.SetContests:
      return setContestsReducer(state, action as ContestSetContests)

    case ContestActionType.SetCurrentContest:
      return setCurrentContestReducer(state, action as ContestSetCurrentContest)

    case ContestActionType.UnsetCurrentContest:
      return unsetCurrentContestReducer(
        state,
        action as ContestUnsetCurrentContest
      )

    case ContestActionType.SetCurrentContestAnnouncements:
      return setCurrentContestAnnouncementsReducer(
        state,
        action as ContestSetCurrentContestAnnouncements
      )

    case ContestActionType.SetCurrentContestProblems:
      return setCurrentContestProblemsReducer(
        state,
        action as ContestSetCurrentContestProblems
      )

    case ContestActionType.SetCurrentContestCurrentProblem:
      return setCurrentContestCurrentProblemReducer(
        state,
        action as ContestSetCurrentContestCurrentProblem
      )

    case ContestActionType.ReadAnnouncements:
      return readAnnouncementsReducer(state, action as ContestReadAnnouncements)
  }
  return state
}
