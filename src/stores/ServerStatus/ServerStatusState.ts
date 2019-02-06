/**
 * `clock` contains last known server status clock.
 * `localClock` contains local computer clock when `clock` set.
 */
export interface ServerStatusState {
    clock?: Date
    localClock: Date
}

export const initialState: ServerStatusState = {
    localClock: new Date()
}