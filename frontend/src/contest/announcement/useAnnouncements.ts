import { useMappedState } from 'redux-react-hook'
import { globalErrorCatcher, useAppThunkDispatch } from 'ugrade/common'
import { UnsubscriptionFunction } from 'ugrade/services/contest/ContestService'
import { AppState, AppThunkAction } from 'ugrade/store'
import { useSingleEffect } from 'ugrade/utils'
import { setAnnouncements } from '../store'

export const subscribeAnnouncementsAction = (): AppThunkAction<
  UnsubscriptionFunction
> => {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    return contestService.subscribeAnnouncements(token, announcements => {
      console.log('get', announcements)
      const stillRelevant = getState().auth.token === token
      if (stillRelevant) {
        dispatch(setAnnouncements(announcements))
      }
    })
  }
}

export function useAnnouncements() {
  const dispatch = useAppThunkDispatch()

  useSingleEffect(
    'USE_ANNOUNCEMENTS',
    () => {
      const subs = dispatch(subscribeAnnouncementsAction())
      return () => {
        subs.then(unsub => unsub()).catch(globalErrorCatcher)
      }
    },
    []
  )

  return useMappedState((state: AppState) => state.contest.announcements)
}
