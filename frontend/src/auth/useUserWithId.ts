import { useState } from 'react'
import { useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/store'
import { useSingleEffect } from 'ugrade/utils'
import { User } from './store'

export function getUserByIdAction(userId: string): AppThunkAction<User> {
  return async (_dispatch, _getState, { authService }) => {
    return authService.getUserById(userId)
  }
}

export function useUserWithId(userId: string) {
  const dispatch = useAppThunkDispatch()
  const [user, setUser] = useState(undefined as User | undefined)

  useSingleEffect(
    'USE_USER_WITH_ID',
    () => {
      dispatch(getUserByIdAction(userId)).then(setUser)
    },
    []
  )

  return user
}
