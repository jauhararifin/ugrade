import { useMappedState } from 'redux-react-hook'
import { globalErrorCatcher, useAppThunkDispatch } from 'ugrade/common'
import { UnsubscriptionFunction } from 'ugrade/services/contest'
import { AppThunkAction } from 'ugrade/store'
import { useSingleEffect } from 'ugrade/utils'
import { getContestInfo, setInfo } from './store'

export function subscribeContestInfoAction(): AppThunkAction<
  UnsubscriptionFunction
> {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    if (token.length > 0) {
      const unsub = contestService.subscribeMyContest(token, contest => {
        const stillRelevant = getState().auth.token === token
        if (stillRelevant) {
          dispatch(setInfo(contest))
        }
      })
      return unsub
    }
    return () => null
  }
}

export function useContestInfo() {
  const dispatch = useAppThunkDispatch()
  useSingleEffect(
    'USE_CONTEST_INFO',
    () => {
      const unsub = dispatch(subscribeContestInfoAction())
      return () => {
        unsub.then(func => func()).catch(globalErrorCatcher)
      }
    },
    []
  )

  return useMappedState(getContestInfo)
}
