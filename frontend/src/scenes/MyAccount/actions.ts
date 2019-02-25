import { AppThunkAction } from '../../stores'
import { setMe, User } from '../../stores/Auth'
import { setUserProfile } from '../../stores/UserProfile'

export const getMyProfile = (): AppThunkAction<User> => {
  return async (dispatch, getState, { authService, userService }) => {
    const token = getState().auth.token
    let me = getState().auth.me
    if (!me) {
      me = await authService.getMe(token)
      dispatch(setMe(me))
    }

    const myProfile = await userService.getMyProfile(token)
    dispatch(
      setUserProfile(myProfile.gender, myProfile.shirtSize, myProfile.address)
    )
    return me
  }
}
