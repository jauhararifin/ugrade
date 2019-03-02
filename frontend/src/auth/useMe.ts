import { useEffect } from 'react'
import { useMappedState } from 'redux-react-hook'
import { useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/store'
import { getMe, setMe } from './store'

export const getMeAction = (): AppThunkAction => {
  return async (dispatch, getState, { authService }) => {
    const token = getState().auth.token
    if (token.length > 0) {
      const me = await authService.getMe(token)
      const stillRelevant = getState().auth.token === token
      if (stillRelevant) dispatch(setMe(me))
    }
  }
}

export function useMe() {
  const dispatch = useAppThunkDispatch()
  useEffect(() => {
    let cancel = false
    ;(async () => {
      while (!cancel) {
        try {
          await dispatch(getMeAction())
          break
        } catch (error) {
          await new Promise(res => setTimeout(res, 5000))
        }
      }
    })().catch(_ => null)
    return () => {
      cancel = true
    }
  }, [])
  return useMappedState(getMe)
}
