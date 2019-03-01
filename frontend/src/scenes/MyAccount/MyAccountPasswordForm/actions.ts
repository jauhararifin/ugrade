import { AppThunkAction } from 'ugrade/store'

export const setPassword = (
  oldPassword: string,
  newPassword: string
): AppThunkAction => {
  return async (_, getState, { authService }) => {
    const token = getState().auth.token
    await authService.setMyPassword(token, oldPassword, newPassword)
  }
}
