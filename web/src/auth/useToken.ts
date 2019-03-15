import { useMappedState } from 'redux-react-hook'
import { getToken } from './store'

export function useToken() {
  return useMappedState(getToken)
}
