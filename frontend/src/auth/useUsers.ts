import lodash from 'lodash'
import { useEffect } from 'react'
import { useMappedState } from 'redux-react-hook'
import { useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/store'
import { getAuth, setUsers } from './store'

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
  const auth = useMappedState(getAuth)
  const dispatch = useAppThunkDispatch()

  useEffect(() => {
    dispatch(getUsersAction(usernames))
  }, [usernames])

  return lodash.values(auth.users).filter(u => usernames.includes(u.username))
}
