import { push } from 'connected-react-router'
import { setSignedIn } from 'ugrade/auth/store'
import { useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/store'

export function signupAction(
  username: string,
  oneTimeCode: string,
  password: string,
  name: string,
  rememberMe: boolean
): AppThunkAction {
  return async (dispatch, getState, { authService }) => {
    const contest = getState().contest.info
    const user = getState().auth.me
    if (contest && user) {
      const token = await authService.signup(
        contest.id,
        username,
        user.email,
        oneTimeCode,
        password,
        name
      )
      const nowContest = getState().contest.info
      const nowUser = getState().auth.me
      const stillRelevant =
        nowContest &&
        nowUser &&
        nowContest.id === contest.id &&
        nowUser.id === user.id
      if (stillRelevant) {
        dispatch(setSignedIn(token, rememberMe))
      }
      dispatch(push('/contest'))
    } else if (!contest) {
      dispatch(push('/enter-contest/'))
    } else if (!user) {
      dispatch(push('/enter-contest/enter-email'))
    }
  }
}

export function useSignUp() {
  const dispatch = useAppThunkDispatch()
  return (
    username: string,
    oneTimeCode: string,
    password: string,
    name: string,
    rememberMe: boolean
  ) => dispatch(signupAction(username, oneTimeCode, password, name, rememberMe))
}
