import { useEffect } from 'react'
import { AppThunkAction, AppThunkDispatch } from '../../stores'
import { setOnline } from '../../stores/ServerStatus'

export type CancelFunction = () => any

export const pingingAction = (
  delay: number = 500
): [AppThunkAction, CancelFunction] => {
  let cancelled = false
  const action: AppThunkAction = async (
    dispatch,
    getState,
    { serverStatusService }
  ) => {
    while (!cancelled) {
      await new Promise(resolve => setTimeout(resolve, delay))
      try {
        await serverStatusService.ping()
        const online = getState().server.online
        if (!online) dispatch(setOnline(true))
      } catch (error) {
        const online = getState().server.online
        if (online) dispatch(setOnline(false))
      }
    }
  }
  const cancel = () => (cancelled = true)
  return [action, cancel]
}

export function useOnlineStatus(dispatch: AppThunkDispatch) {
  useEffect(() => {
    const [action, cancel] = pingingAction()
    dispatch(action).catch(() => null)
    return () => {
      cancel()
    }
  }, [])
}
