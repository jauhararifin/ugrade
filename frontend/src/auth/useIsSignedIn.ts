import { useMappedState } from 'redux-react-hook'
import { getIsSignedIn } from 'ugrade/stores/Auth'

export function useIsSignedIn() {
  return useMappedState(getIsSignedIn)
}
