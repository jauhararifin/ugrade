import { createSelector } from 'reselect'
import { AppState } from 'ugrade/store'

export function getServerStatus(state: AppState) {
  return state.server
}

export const getIsOnline = createSelector(
  getServerStatus,
  serverStatus => serverStatus.online
)

export const getClock = createSelector(
  getServerStatus,
  serverStatus => ({
    clock: serverStatus.clock,
    localClock: serverStatus.localClock,
  })
)
