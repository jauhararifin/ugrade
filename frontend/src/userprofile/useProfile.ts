import { useEffect } from 'react'
import { useMappedState } from 'redux-react-hook'
import { useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/store'
import { getUserProfile, setUserProfile } from './store'

export const getProfileAction = (): AppThunkAction => {
  return async (dispatch, getState, { userService }) => {
    const token = getState().auth.token
    if (token.length > 0) {
      const myProfile = await userService.getMyProfile(token)
      const stillRelevant = getState().auth.token === token
      if (stillRelevant) {
        dispatch(
          setUserProfile(
            myProfile.gender,
            myProfile.shirtSize,
            myProfile.address
          )
        )
      }
    }
  }
}

export function useProfile() {
  const dispatch = useAppThunkDispatch()
  useEffect(() => {
    dispatch(getProfileAction())
  }, [])
  return useMappedState(getUserProfile)
}
