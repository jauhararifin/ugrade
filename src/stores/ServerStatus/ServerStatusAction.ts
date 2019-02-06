
export enum ServerStatusActionType {
    SetServerClock = 'SET_SERVER_CLOCK'
}

export interface ServerStatusSetServerClock {
    type: ServerStatusActionType.SetServerClock
    clock: Date
    localClock: Date
}

export function setServerClock(clock: Date, localClock?: Date): ServerStatusSetServerClock {
    return {
        type: ServerStatusActionType.SetServerClock,
        clock,
        localClock: localClock || new Date()
    }
}

export type ServerStatusAction = ServerStatusSetServerClock