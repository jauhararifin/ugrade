import { createSelector } from 'reselect'
import { AppState } from 'ugrade/store'

export function getSetting(state: AppState) {
  return state.setting
}

export const getProxySetting = createSelector(
  getSetting,
  setting => setting.proxy
)
