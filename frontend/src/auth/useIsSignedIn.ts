import { useMappedState } from 'redux-react-hook'
import { getIsSignedIn } from 'ugrade/auth/store'

export function useIsSignedIn() {
  return useMappedState(getIsSignedIn)
}
