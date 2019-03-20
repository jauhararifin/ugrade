import { ContestActionType } from './ContestAction'
import { ContestState, Problem } from './ContestState'

export interface ContestSetProblems {
  type: ContestActionType.SetProblems
  problems: Problem[]
}

export function setProblems(problems: Problem[]): ContestSetProblems {
  return {
    type: ContestActionType.SetProblems,
    problems,
  }
}

export function setProblemsReducer(state: ContestState, action: ContestSetProblems): ContestState {
  const nextProblems: { [id: string]: Problem } = {}
  action.problems.slice().forEach(prob => (nextProblems[prob.id] = prob))
  return {
    ...state,
    problems: { ...state.problems, ...nextProblems },
  }
}
