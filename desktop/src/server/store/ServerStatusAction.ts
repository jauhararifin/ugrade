import { ServerStatusSetOnline } from './ServerStatusSetOnline'
import { ServerStatusSetServerClock } from './ServerStatusSetServerClock'

export enum ServerStatusActionType {
  SetServerClock = 'SERVER_STATUS_SET_SERVER_CLOCK',
  SetOnline = 'SERVER_STATUS_SET_ONLINE',
}

export type ServerStatusAction =
  | ServerStatusSetServerClock
  | ServerStatusSetOnline
