import { useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/store'

export const setPasswordAction = (
  oldPassword: string,
  newPassword: string
): AppThunkAction => {
  return async (_, getState, { authService }) => {
    const token = getState().auth.token
    await authService.setMyPassword(token, oldPassword, newPassword)
  }
}

export function useSetPassword() {
  const dispatch = useAppThunkDispatch()
  return (oldPassword: string, newPassword: string) =>
    dispatch(setPasswordAction(oldPassword, newPassword))
}
