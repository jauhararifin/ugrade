import { setMe } from 'ugrade/auth/store'
import { AppThunkAction } from 'ugrade/store'
import {
  GenderType,
  setUserProfile,
  ShirtSizeType,
} from 'ugrade/userprofile/store'

export const setProfile = (
  name: string,
  shirtSize?: ShirtSizeType,
  gender?: GenderType,
  address?: string
): AppThunkAction => {
  return async (dispatch, getState, { authService, userService }) => {
    const token = getState().auth.token
    let currentMe = getState().auth.me
    let stillRelevant = true
    if (!currentMe) {
      currentMe = await authService.getMe(token)
      stillRelevant = getState().auth.token === token
      if (stillRelevant) dispatch(setMe(currentMe))
    }

    if (stillRelevant) {
      await userService.setMyProfile(token, name, gender, shirtSize, address)

      dispatch(setMe({ ...currentMe, name }))
      dispatch(setUserProfile(gender, shirtSize, address))
    }
  }
}
