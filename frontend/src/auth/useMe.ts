import { useMappedState } from 'redux-react-hook'
import { getMe } from './store'

export function useMe() {
  return useMappedState(getMe)
}
