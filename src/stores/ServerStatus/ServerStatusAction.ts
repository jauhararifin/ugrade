import { ServerStatusSetServerClock } from './ServerStatusSetServerClock'

export enum ServerStatusActionType {
  SetServerClock = 'SERVER_STATUS_SET_SERVER_CLOCK',
}

export type ServerStatusAction = ServerStatusSetServerClock
