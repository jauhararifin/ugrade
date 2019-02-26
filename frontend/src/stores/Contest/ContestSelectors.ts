import { AppState } from '../state'
import { Problem } from './ContestState'

export function getProblemList(state: AppState): Problem[] | undefined {
  const problems = state.contest.problems
  if (problems) return Object.keys(problems).map(k => problems[k])
  return undefined
}
