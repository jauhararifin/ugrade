import { useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/store'
import { UserPermission } from './store'

export function updateUserPermissionsAction(
  userId: string,
  permissions: UserPermission[]
): AppThunkAction<UserPermission[]> {
  return async (_dispatch, getState, { authService }) => {
    const token = getState().auth.token
    return authService.setUserPermissions(token, userId, permissions)
  }
}

export function useUpdateUserPermissions() {
  const dispatch = useAppThunkDispatch()
  return (userId: string, permissions: UserPermission[]) =>
    dispatch(updateUserPermissionsAction(userId, permissions))
}
