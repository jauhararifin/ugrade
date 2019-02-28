import { useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/stores'
import { setMe, User } from 'ugrade/stores/Auth'

export const getMeAction = (): AppThunkAction<User> => {
  return async (dispatch, getState, { authService }) => {
    const token = getState().auth.token
    const me = await authService.getMe(token)
    const stillRelevant = getState().auth.token === token
    if (stillRelevant) dispatch(setMe(me))
    return me
  }
}

export async function useLoadMe() {
  const dispatch = useAppThunkDispatch()
  return () => dispatch(getMeAction())
}
