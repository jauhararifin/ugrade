import { useMappedState } from 'redux-react-hook'
import { getClarificationList } from '../store'
import { useClarifications } from './useClarifications'

export function useClarificationList() {
  useClarifications()
  return useMappedState(getClarificationList)
}
