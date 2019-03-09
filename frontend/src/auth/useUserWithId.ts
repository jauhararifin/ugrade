import { useEffect, useState } from 'react'
import { useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/store'
import { User } from './store'

export function getUserByIdAction(userId: string): AppThunkAction<User> {
  return async (_dispatch, _getState, { authService }) => {
    return authService.getUserById(userId)
  }
}

export function useUserWithId(userId: string) {
  const dispatch = useAppThunkDispatch()
  const [user, setUser] = useState(undefined as User | undefined)

  useEffect(() => {
    dispatch(getUserByIdAction(userId)).then(setUser)
  }, [])

  return user
}
