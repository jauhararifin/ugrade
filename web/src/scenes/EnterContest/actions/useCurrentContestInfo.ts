import { useMappedState } from 'redux-react-hook'
import { getContestInfo } from 'ugrade/contest/store'

export function useCurrentContestInfo() {
  return useMappedState(getContestInfo)
}
