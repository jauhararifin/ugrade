import { useEffect, useState } from 'react'
import { globalErrorCatcher, useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/store'
import { UserProfile } from './store'

export const getUserProfileByIdAction = (userId: string): AppThunkAction<UserProfile> => {
  return async (_dispatch, getState, { userService }) => {
    const token = getState().auth.token
    return userService.getUserProfile(token, userId)
  }
}

export function useUserProfileWithId(userId?: string) {
  const dispatch = useAppThunkDispatch()
  const [profile, setProfile] = useState(undefined as UserProfile | undefined)

  useEffect(() => {
    if (userId) {
      dispatch(getUserProfileByIdAction(userId))
        .then(setProfile)
        .catch(globalErrorCatcher)
    } else setProfile(undefined)
  }, [userId])

  return profile
}
