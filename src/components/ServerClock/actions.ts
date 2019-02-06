import { AppThunkAction } from "../../stores"
import { setServerClock } from "../../stores/ServerStatus"

export const getServerClockAction = (): AppThunkAction => {
    return async (dispatch, getState, { serverStatusService }) => {
        let triedTimes = 0
        while (true) {
            try {
                triedTimes++
                const serverClock = await serverStatusService.getClock()
                const localClock = new Date()
                await dispatch(setServerClock(serverClock, localClock))
                return
            } catch (error) {
                await new Promise(resolve => setTimeout(resolve, triedTimes > 10 ? 10000 : 3000))
            }
        }
    }
}
