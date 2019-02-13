import { ContestActionType } from './ContestAction'
import { Contest, ContestState, Problem } from './ContestState'

export interface ContestSetCurrentContestCurrentProblem {
  type: ContestActionType.SetCurrentContestCurrentProblem
  contestId: number
  problem: number | Problem
}

export function setCurrentContestCurrentProblem(
  contest: number | Contest,
  problem: number | Problem
) {
  return {
    type: ContestActionType.SetCurrentContestCurrentProblem,
    contestId: typeof contest === 'number' ? contest : contest.id,
    problem,
  }
}

export function setCurrentContestCurrentProblemReducer(
  state: ContestState,
  action: ContestSetCurrentContestCurrentProblem
) {
  const currentContest = state.currentContest
  if (currentContest && currentContest.id === action.contestId) {
    let resultProblem
    if (typeof action.problem === 'number') {
      resultProblem = (currentContest.problems || [])
        .slice()
        .filter(prob => prob.id === action.problem)
        .pop()
    } else {
      resultProblem = action.problem
    }
    return {
      ...state,
      currentContest: {
        ...currentContest,
        currentProblem: resultProblem as Problem,
      },
    }
  }
  return { ...state }
}
