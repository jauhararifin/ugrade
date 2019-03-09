import { useEffect, useState } from 'react'
import { useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/store'
import { UserProfile } from './store'

export const getUserProfileByIdAction = (
  userId: string
): AppThunkAction<UserProfile> => {
  return async (_dispatch, getState, { userService }) => {
    const token = getState().auth.token
    return userService.getUserProfile(token, userId)
  }
}

export function useUserProfileWithId(userId: string) {
  const dispatch = useAppThunkDispatch()
  const [profile, setProfile] = useState(undefined as UserProfile | undefined)

  useEffect(() => {
    dispatch(getUserProfileByIdAction(userId)).then(setProfile)
  }, [])

  return profile
}
