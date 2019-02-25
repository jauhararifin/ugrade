import { push } from 'connected-react-router'
import { AppThunkAction } from '../../../stores'
import { setMe } from '../../../stores/Auth'
import { setRegistered } from '../../../stores/Contest'

export function setEmailAction(email: string): AppThunkAction {
  return async (dispatch, getState, { authService }) => {
    const contest = getState().contest.info
    if (!contest) dispatch(push('/enter-contest'))
    else {
      const user = await authService.getUserByEmail(contest.id, email)
      dispatch(setMe(user))
      dispatch(setRegistered(user.username.length > 0))
      if (user.username.length > 0) {
        dispatch(push('/enter-contest/enter-password'))
      } else dispatch(push('/enter-contest/signup'))
    }
  }
}
