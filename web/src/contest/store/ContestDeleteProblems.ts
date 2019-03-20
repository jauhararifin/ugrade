import lodash from 'lodash'
import { ContestActionType } from './ContestAction'
import { ContestState } from './ContestState'

export interface ContestDeleteProblems {
  type: ContestActionType.DeleteProblems
  problems: string[]
}

export function deleteProblems(problems: string[]): ContestDeleteProblems {
  return {
    type: ContestActionType.DeleteProblems,
    problems,
  }
}

export function deleteProblemsReducer(state: ContestState, action: ContestDeleteProblems): ContestState {
  state = lodash.cloneDeep(state)
  if (state.problems) {
    for (const id of action.problems) delete state.problems[id]
  }
  return state
}
