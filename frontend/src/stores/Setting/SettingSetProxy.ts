import { SettingAction, SettingActionType } from './SettingAction'
import {
  SETTING_PROXY_HOST_KEY,
  SETTING_PROXY_PASSWORD_KEY,
  SETTING_PROXY_PORT_KEY,
  SETTING_PROXY_USERNAME_KEY,
  SettingState,
} from './SettingState'

export interface SettingSetProxy {
  type: SettingActionType.SetProxy
  host: string
  port: number
  username: string
  password: string
}

export function setProxy(
  host: string,
  port: string | number,
  username?: string,
  password?: string
): SettingSetProxy {
  return {
    type: SettingActionType.SetProxy,
    host,
    port: Number(port),
    username: username ? username : '',
    password: password ? password : '',
  }
}

export function setProxyReducer(state: SettingState, action: SettingAction) {
  const nextState = {
    ...state,
    proxyHost: action.host,
    proxyPort: action.port,
    proxyUsername: action.username,
    proxyPassword: action.password,
  }
  localStorage.setItem(SETTING_PROXY_HOST_KEY, nextState.proxyHost)
  localStorage.setItem(SETTING_PROXY_PORT_KEY, nextState.proxyPort.toString())
  localStorage.setItem(SETTING_PROXY_USERNAME_KEY, nextState.proxyUsername)
  localStorage.setItem(SETTING_PROXY_PASSWORD_KEY, nextState.proxyPassword)
  return nextState
}
