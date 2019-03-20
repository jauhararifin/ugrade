import lodash from 'lodash'
import { useMappedState } from 'redux-react-hook'
import { useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/store'
import { doPeriodically, useSingleEffect } from 'ugrade/utils'
import { getMe, setMe } from './store'

export const getMeAction = (): AppThunkAction => {
  return async (dispatch, getState, { authService }) => {
    const token = getState().auth.token
    if (token.length > 0) {
      const me = await authService.getMe(token)
      const stillRelevant = getState().auth.token === token
      const currentMe = getState().auth.me
      if (stillRelevant && !lodash.isEqual(currentMe, me)) {
        dispatch(setMe(me))
      }
    }
  }
}

export function useMe() {
  const dispatch = useAppThunkDispatch()
  useSingleEffect('USE_ME_PERIODIC_CALL', () => doPeriodically(async () => dispatch(getMeAction())), [])

  return useMappedState(getMe)
}
