import { useEffect } from 'react'
import { useMappedState } from 'redux-react-hook'
import { globalErrorCatcher, useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/store'
import { getUserProfile, setUserProfile } from './store'

export const getMyProfileAction = (): AppThunkAction => {
  return async (dispatch, getState, { userService }) => {
    const token = getState().auth.token
    if (token.length > 0) {
      const myProfile = await userService.getMyProfile(token)
      const stillRelevant = getState().auth.token === token
      if (stillRelevant) {
        dispatch(setUserProfile(myProfile.gender, myProfile.shirtSize, myProfile.address))
      }
    }
  }
}

export function useMyProfile() {
  const dispatch = useAppThunkDispatch()
  useEffect(() => {
    let cancel = false
    ;(async () => {
      while (!cancel) {
        try {
          await dispatch(getMyProfileAction())
          break
        } catch (error) {
          await new Promise(r => setTimeout(r, 5000))
        }
      }
    })().catch(globalErrorCatcher)
    return () => {
      cancel = true
    }
  }, [])
  return useMappedState(getUserProfile)
}
