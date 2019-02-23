import { ContestActionType } from './ContestAction'
import { ContestState, Problem } from './ContestState'

export interface ContestSetProblems {
  type: ContestActionType.SetProblems
  problems: Problem[]
}

export function setCurrentContestProblems(
  problems: Problem[]
): ContestSetProblems {
  return {
    type: ContestActionType.SetProblems,
    problems,
  }
}

export function setProblemsReducer(
  state: ContestState,
  action: ContestSetProblems
): ContestState {
  const nextState = { ...state }
  const nextProblems = nextState.problems || {}
  action.problems.slice().forEach(prob => (nextProblems[prob.id] = prob))
  nextState.problems = nextProblems
  return nextState
}
