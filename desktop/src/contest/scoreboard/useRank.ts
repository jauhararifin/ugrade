import { useMappedState } from 'redux-react-hook'
import { getRank } from '../store'
import { useScoreboard } from './useScoreboard'

export function useRank() {
  useScoreboard()
  return useMappedState(getRank)
}
