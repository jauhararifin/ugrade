import lodash from 'lodash'
import { useEffect } from 'react'
import { useMappedState } from 'redux-react-hook'
import { globalErrorCatcher, useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/store'
import { getAuth, setUsers } from './store'
import { useMe } from './useMe'

export function getUsersAction(usernames: string[]): AppThunkAction {
  return async (dispatch, getState, { authService }) => {
    const me = getState().auth.me
    if (me) {
      const contestId = me.contestId
      const users = await authService.getUserByUsernames(contestId, usernames)
      const currentMe = getState().auth.me
      const stillRelevant = currentMe && currentMe.contestId === contestId
      if (stillRelevant) {
        dispatch(setUsers(lodash.zipObject(users.map(u => u.id), users)))
      }
    }
  }
}

export function useUsers(usernames: string[]) {
  const me = useMe()
  const auth = useMappedState(getAuth)
  const dispatch = useAppThunkDispatch()

  useEffect(() => {
    dispatch(getUsersAction(usernames)).catch(globalErrorCatcher)
  }, [me, usernames])

  return lodash.values(auth.users).filter(u => usernames.includes(u.username))
}
