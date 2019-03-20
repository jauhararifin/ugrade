import { useMappedState } from 'redux-react-hook'
import { useAppDispatch } from 'ugrade/common'
import { getProxySetting, ProxySetting, setProxy } from './store'

export function useProxySetting(): [
  ProxySetting,
  (host: string, port: string | number, username?: string, password?: string) => any
] {
  const proxySetting = useMappedState(getProxySetting)
  const dispatch = useAppDispatch()
  const setFunction = (host: string, port: string | number, username?: string, password?: string) => {
    dispatch(setProxy(host, port, username, password))
  }
  return [proxySetting, setFunction]
}
