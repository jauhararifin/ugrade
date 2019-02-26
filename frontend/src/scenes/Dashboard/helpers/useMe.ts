import { useState } from 'react'

import { AppThunkAction, AppThunkDispatch } from '../../../stores'
import { setMe, User } from '../../../stores/Auth'

export const getMeAction = (): AppThunkAction<User> => {
  return async (dispatch, getState, { authService }) => {
    const token = getState().auth.token
    const me = await authService.getMe(token)
    dispatch(setMe(me))
    return me
  }
}

export async function useMe(dispatch: AppThunkDispatch) {
  const [started, setStarted] = useState(false)
  if (!started) {
    setStarted(true)
    await dispatch(getMeAction())
  }
}
