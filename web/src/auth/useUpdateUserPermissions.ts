import { useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/store'
import { setMe, UserPermission } from './store'

export function updateUserPermissionsAction(
  userId: string,
  permissions: UserPermission[]
): AppThunkAction<UserPermission[]> {
  return async (dispatch, getState, { authService }) => {
    const token = getState().auth.token
    const newPermissions = await authService.setUserPermissions(token, userId, permissions)
    const stillRelevant = getState().auth.token === token
    if (stillRelevant) {
      const me = getState().auth.me
      if (me && me.id === userId) {
        dispatch(setMe({ ...me, permissions: newPermissions }))
      }
    }
    return newPermissions
  }
}

export function useUpdateUserPermissions() {
  const dispatch = useAppThunkDispatch()
  return (userId: string, permissions: UserPermission[]) => dispatch(updateUserPermissionsAction(userId, permissions))
}
