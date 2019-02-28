import { useDispatch, useMappedState } from 'redux-react-hook'
import { getProxySetting, ProxySetting, setProxy } from 'ugrade/stores/Setting'

export function useProxySetting(): [
  ProxySetting,
  (
    host: string,
    port: string | number,
    username?: string,
    password?: string
  ) => any
] {
  const proxySetting = useMappedState(getProxySetting)
  const dispatch = useDispatch()
  const setFunction = (
    host: string,
    port: string | number,
    username?: string,
    password?: string
  ) => {
    dispatch(setProxy(host, port, username, password))
  }
  return [proxySetting, setFunction]
}
