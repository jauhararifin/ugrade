import { Reducer } from 'redux'

import { SettingActionType } from './SettingAction'
import { setProxyReducer, SettingSetProxy } from './SettingSetProxy'
import { initialState, SettingState } from './SettingState'

export const settingReducer: Reducer<SettingState> = (
  state: SettingState = initialState,
  action
): SettingState => {
  switch (action.type) {
    case SettingActionType.SetProxy:
      return setProxyReducer(state, action as SettingSetProxy)
  }
  return state
}
