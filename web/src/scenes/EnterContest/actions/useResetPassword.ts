import { push } from 'connected-react-router'
import { useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/store'

export function resetPasswordAction(oneTimeCode: string, password: string): AppThunkAction {
  return async (dispatch, getState, { authService }) => {
    const contest = getState().contest.info
    const user = getState().auth.me
    if (contest && user) {
      await authService.resetPassword(contest.id, user.email, oneTimeCode, password)
      const nowContest = getState().contest.info
      const nowUser = getState().auth.me
      const stillRelevant = nowContest && nowUser && nowContest.id === contest.id && nowUser.id === user.id
      if (stillRelevant) {
        dispatch(push('/enter-contest/enter-password'))
      }
    } else if (!contest) {
      dispatch(push('/enter-contest/'))
    } else if (!user) {
      dispatch(push('/enter-contest/enter-email'))
    }
  }
}

export function useResetPassword() {
  const dispatch = useAppThunkDispatch()
  return (oneTimeCode: string, password: string) => dispatch(resetPasswordAction(oneTimeCode, password))
}
