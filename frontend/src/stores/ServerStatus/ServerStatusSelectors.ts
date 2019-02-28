import { createSelector } from 'reselect'
import { AppState } from 'ugrade/stores'

export function getServerStatus(state: AppState) {
  return state.server
}

export const getIsOnline = createSelector(
  getServerStatus,
  serverStatus => serverStatus.online
)
