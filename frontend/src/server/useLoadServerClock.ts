import { useEffect } from 'react'
import { globalErrorCatcher, useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/store'
import { useSingleEffect } from 'ugrade/utils'
import { setServerClock } from './store'

export function getServerClockAction(): AppThunkAction {
  return async (dispatch, _getState, { serverStatusService }) => {
    const begin = new Date()
    const serverClock = await serverStatusService.getClock()
    const finish = new Date()
    const offset = (finish.getTime() - begin.getTime()) / 2.0
    const localClock = new Date(begin.getTime() + offset)
    dispatch(setServerClock(serverClock, localClock))
  }
}

export function useLoadServerClock() {
  const dispatch = useAppThunkDispatch()
  useSingleEffect(
    'LOAD_SERVER_CLOCK',
    () => {
      const loadFunction = async () => {
        let success = false
        while (!success) {
          try {
            await dispatch(getServerClockAction())
            success = true
          } catch (error) {
            await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000))
          }
        }
      }
      loadFunction().catch(globalErrorCatcher)
    },
    []
  )
}
