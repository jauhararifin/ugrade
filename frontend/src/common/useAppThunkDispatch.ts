import { useDispatch } from 'redux-react-hook'
import { AppThunkDispatch } from 'ugrade/stores'

export function useAppThunkDispatch() {
  return useDispatch() as AppThunkDispatch
}
