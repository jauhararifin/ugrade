import { useDispatch } from 'redux-react-hook'
import { AppThunkDispatch } from 'ugrade/store'

export function useAppThunkDispatch() {
  return useDispatch() as AppThunkDispatch
}
