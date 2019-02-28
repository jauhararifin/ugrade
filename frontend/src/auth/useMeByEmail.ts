import { push } from 'connected-react-router'
import { useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/stores'
import { setMe } from 'ugrade/stores/Auth'
import { setRegistered } from 'ugrade/stores/Contest'

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
