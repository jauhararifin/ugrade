import { useMappedState } from 'redux-react-hook'
import { getContestInfo } from './store'

export function useContestInfo() {
  return useMappedState(getContestInfo)
}
