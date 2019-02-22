import { ContestActionType } from './ContestAction'
import { Contest, ContestState, Problem } from './ContestState'

export interface ContestSetCurrentContestProblems {
  type: ContestActionType.SetCurrentContestProblems
  contestId: number
  problems: Problem[]
  problemOrder: number[]
}

export function setCurrentContestProblems(
  contest: number | Contest,
  problems: Problem[],
  problemOrder: number[]
): ContestSetCurrentContestProblems {
  return {
    type: ContestActionType.SetCurrentContestProblems,
    contestId: typeof contest === 'number' ? contest : contest.id,
    problems,
    problemOrder,
  }
}

export function setCurrentContestProblemsReducer(
  state: ContestState,
  action: ContestSetCurrentContestProblems
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
