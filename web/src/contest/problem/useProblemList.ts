import { useMappedState } from 'redux-react-hook'
import { getProblemList } from '../store'
import { useProblems } from './useProblems'

export function useProblemList() {
  useProblems()
  return useMappedState(getProblemList)
}
