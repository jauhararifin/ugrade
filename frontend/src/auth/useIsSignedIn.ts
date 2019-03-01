import { useMappedState } from 'redux-react-hook'
import { getIsSignedIn } from './store'

export function useIsSignedIn() {
  return useMappedState(getIsSignedIn)
}
