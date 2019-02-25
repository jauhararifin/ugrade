import { push } from 'connected-react-router'

import { AppThunkAction } from '../../../stores'
import { setSignedIn } from '../../../stores/Auth'

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
      dispatch(setSignedIn(token, rememberMe))
      dispatch(push('/contest'))
    } else if (!contest) {
      dispatch(push('/enter-contest/'))
    } else if (!user) {
      dispatch(push('/enter-contest/enter-email'))
    }
  }
}
