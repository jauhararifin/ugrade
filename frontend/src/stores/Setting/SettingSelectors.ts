import { createSelector } from 'reselect'
import { AppState } from 'ugrade/stores'

export function getSetting(state: AppState) {
  return state.setting
}

export const getProxySetting = createSelector(
  getSetting,
  setting => setting.proxy
)
