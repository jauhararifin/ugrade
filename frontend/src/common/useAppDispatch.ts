import { Dispatch } from 'redux'
import { useDispatch } from 'redux-react-hook'
import { AppAction } from 'ugrade/stores'

export function useAppDispatch() {
  return useDispatch() as Dispatch<AppAction>
}
