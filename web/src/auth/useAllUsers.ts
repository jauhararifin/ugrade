import lodash from 'lodash'
import { useEffect } from 'react'
import { useMappedState } from 'redux-react-hook'
import { globalErrorCatcher, useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/store'
import { getAuth, setUsers } from './store'
import { useMe } from './useMe'

export function getAllUsersAction(): AppThunkAction {
  return async (dispatch, getState, { authService }) => {
    const me = getState().auth.me
    const token = getState().auth.token
    if (me) {
      const contestId = me.contestId
      const users = await authService.getUsers(token, contestId)
      const currentMe = getState().auth.me
      const stillRelevant = currentMe && currentMe.contestId === contestId
      if (stillRelevant) {
        dispatch(setUsers(lodash.zipObject(users.map(u => u.id), users)))
      }
    }
  }
}

export function useAllUsers() {
  const me = useMe()
  const auth = useMappedState(getAuth)
  const dispatch = useAppThunkDispatch()

  useEffect(() => {
    dispatch(getAllUsersAction()).catch(globalErrorCatcher)
  }, [me])

  return lodash.values(auth.users)
}
