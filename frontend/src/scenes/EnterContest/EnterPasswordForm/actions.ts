import { push } from 'connected-react-router'
import { AppThunkAction } from '../../../stores'
import { setSignedIn } from '../../../stores/Auth'

export function signinAction(
  password: string,
  rememberMe: boolean
): AppThunkAction {
  return async (dispatch, getState, { authService }) => {
    const contest = getState().contest.info
    const user = getState().auth.me
    if (contest && user) {
      const token = await authService.signin(contest.id, user.email, password)
      dispatch(setSignedIn(token, rememberMe))
      dispatch(push('/contest'))
    } else if (!contest) {
      dispatch(push('/enter-contest/'))
    } else if (!user) {
      dispatch(push('/enter-contest/enter-email'))
    }
  }
}

export function forgotPasswordAction(): AppThunkAction {
  return async (dispatch, getState, { authService }) => {
    const contest = getState().contest.info
    const user = getState().auth.me
    if (contest && user) {
      await authService.forgotPassword(contest.id, user.email)
      dispatch(push('/enter-contest/reset-password'))
    } else if (!contest) {
      dispatch(push('/enter-contest/'))
    } else if (!user) {
      dispatch(push('/enter-contest/enter-email'))
    }
  }
}
