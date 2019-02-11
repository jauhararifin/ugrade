import ActionToaster from '../../../middlewares/ErrorToaster/ActionToaster'
import { User } from '../../../services/auth'
import { AppThunkAction } from '../../../stores'
import { GenderType, setMe, ShirtSizeType } from '../../../stores/Auth'

export const setProfile = (
  name: string,
  shirtSize?: ShirtSizeType,
  gender?: GenderType,
  address?: string
): AppThunkAction<User> => {
  return async (dispatch, getState, { authService }) => {
    const token = getState().auth.token
    const me = await authService.setMyProfile(
      token,
      name,
      gender,
      shirtSize,
      address
    )
    await dispatch(setMe(me))
    ActionToaster.showSuccessToast('Profile Changed')
    return me
  }
}
