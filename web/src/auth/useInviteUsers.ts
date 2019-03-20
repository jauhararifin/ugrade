import { useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/store'
import { UserPermission } from './store'

export function inviteUserAction(userEmails: string[], permissions: UserPermission[]): AppThunkAction {
  return async (_dispatch, getState, { authService }) => {
    const token = getState().auth.token
    await authService.addUser(
      token,
      userEmails.map(email => ({
        email,
        permissions,
      }))
    )
  }
}

export function useInviteUsers() {
  const dispatch = useAppThunkDispatch()
  return (emails: string[], permissions: UserPermission[]) => dispatch(inviteUserAction(emails, permissions))
}
