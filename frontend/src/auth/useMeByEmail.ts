import { push } from 'connected-react-router'
import { useAppThunkDispatch } from 'ugrade/common'
import { setRegistered } from 'ugrade/contest/store'
import { AppThunkAction } from 'ugrade/store'
import { setMe } from './store'

export function SetMeByEmailAction(email: string): AppThunkAction {
  return async (dispatch, getState, { authService }) => {
    const contest = getState().contest.info
    if (!contest) dispatch(push('/enter-contest'))
    else {
      const user = await authService.getUserByEmail(contest.id, email)
      const stillRelevant = user.contestId === contest.id
      if (stillRelevant) {
        dispatch(setMe(user))
        dispatch(setRegistered(user.username.length > 0))
        if (user.username.length > 0) {
          dispatch(push('/enter-contest/enter-password'))
        } else dispatch(push('/enter-contest/signup'))
      }
    }
  }
}

export function useSetMeByEmail() {
  const dispatch = useAppThunkDispatch()
  return (email: string) => dispatch(SetMeByEmailAction(email))
}
