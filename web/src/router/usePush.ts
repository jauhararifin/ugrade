import { push } from 'connected-react-router'
import { useAppDispatch } from 'ugrade/common'

export function usePush() {
  const dispatch = useAppDispatch()
  return (location: string) => {
    dispatch(push(location))
  }
}
