import { setMe, User } from 'ugrade/auth/store'
import { AppThunkAction } from 'ugrade/store'
import { setUserProfile } from 'ugrade/userprofile/store'

export const getMyProfile = (): AppThunkAction<User> => {
  return async (dispatch, getState, { authService, userService }) => {
    const token = getState().auth.token
    let me = getState().auth.me
    let stillRelevant = true
    if (!me) {
      me = await authService.getMe(token)
      stillRelevant = getState().auth.token === token
      if (stillRelevant) dispatch(setMe(me))
    }

    if (stillRelevant) {
      const myProfile = await userService.getMyProfile(token)
      dispatch(
        setUserProfile(myProfile.gender, myProfile.shirtSize, myProfile.address)
      )
    }
    return me
  }
}
