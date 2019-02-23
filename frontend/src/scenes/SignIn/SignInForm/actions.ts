import { AppThunkAction } from '../../../stores'
import { setMe, setSignedIn } from '../../../stores/Auth'
import { setUserProfile } from '../../../stores/UserProfile'

export const signInAction = (
  usernameOrPassword: string,
  password: string,
  rememberMe: boolean
): AppThunkAction => {
  return async (dispatch, getState, { authService, userService }) => {
    const contestId = getState().contest.id as string
    const token = await authService.signin(
      contestId,
      usernameOrPassword,
      password
    )
    const me = await userService.getMyProfile(token)
    dispatch(setSignedIn(token, rememberMe))
    dispatch(setMe(me))
    dispatch(setUserProfile(me.gender, me.shirtSize, me.address))
  }
}
