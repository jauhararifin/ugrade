import { push } from 'connected-react-router'
import { useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/store'
import { setSignedIn } from './store'

export function signinAction(
  password: string,
  rememberMe: boolean
): AppThunkAction {
  return async (dispatch, getState, { authService }) => {
    const contest = getState().contest.info
    const user = getState().auth.me
    if (contest && user) {
      const token = await authService.signin(contest.id, user.email, password)
      const nowContest = getState().contest.info
      if (nowContest && nowContest.id === contest.id) {
        dispatch(setSignedIn(token, rememberMe))
        dispatch(push('/contest'))
      }
    } else if (!contest) {
      dispatch(push('/enter-contest/'))
    } else if (!user) {
      dispatch(push('/enter-contest/enter-email'))
    }
  }
}

export function useSignIn() {
  const dispatch = useAppThunkDispatch()
  return (password: string, rememberMe: boolean) =>
    dispatch(signinAction(password, rememberMe))
}
