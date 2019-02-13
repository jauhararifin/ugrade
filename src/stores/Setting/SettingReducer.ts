import { Reducer } from 'redux'

import { SettingActionType } from './SettingAction'
import {
  initialState,
  SETTING_PROXY_HOST_KEY,
  SETTING_PROXY_PASSWORD_KEY,
  SETTING_PROXY_PORT_KEY,
  SETTING_PROXY_USERNAME_KEY,
  SettingState,
} from './SettingState'

export const settingReducer: Reducer<SettingState> = (
  state: SettingState = initialState,
  action
): SettingState => {
  switch (action.type) {
    case SettingActionType.SetProxy:
      const result = {
        ...state,
        proxyHost: action.host,
        proxyPort: action.port,
        proxyUsername: action.username,
        proxyPassword: action.password,
      }
      localStorage.setItem(SETTING_PROXY_HOST_KEY, result.proxyHost)
      localStorage.setItem(SETTING_PROXY_PORT_KEY, result.proxyPort)
      localStorage.setItem(SETTING_PROXY_USERNAME_KEY, result.proxyUsername)
      localStorage.setItem(SETTING_PROXY_PASSWORD_KEY, result.proxyPassword)
      return result
  }
  return state
}
