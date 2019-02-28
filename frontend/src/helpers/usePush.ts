import { push } from 'connected-react-router'
import { useDispatch } from 'redux-react-hook'

export default function usePush() {
  const dispatch = useDispatch()
  return (location: string) => {
    dispatch(push(location))
  }
}
