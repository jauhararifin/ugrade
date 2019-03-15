import { useMappedState } from 'redux-react-hook'
import { getMe } from 'ugrade/auth/store'

export function useCurrentMe() {
  return useMappedState(getMe)
}
