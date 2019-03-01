import { useEffect } from 'react'
import { useMappedState } from 'redux-react-hook'
import { useAppThunkDispatch } from 'ugrade/common'
import {
  AnnouncementSubscribeCallback,
  AnnouncementUbsubscribeFunction,
} from 'ugrade/services/contest/ContestService'
import { AppState, AppThunkAction } from 'ugrade/store'
import { Announcement, setAnnouncements } from '../store'

export const getAnnouncementsAction = (): AppThunkAction<Announcement[]> => {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    const announcements = await contestService.getAnnouncements(token)
    const stillRelevant = getState().auth.token === token
    if (stillRelevant) dispatch(setAnnouncements(announcements))
    return announcements
  }
}

export const subscribeAnnouncementsAction = (
  callback: AnnouncementSubscribeCallback
): AppThunkAction<AnnouncementUbsubscribeFunction> => {
  return async (_dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    return contestService.subscribeAnnouncements(token, callback)
  }
}

export function useAnnouncements() {
  const dispatch = useAppThunkDispatch()

  useEffect(() => {
    const subs = dispatch(
      subscribeAnnouncementsAction(newAnnouncements => {
        dispatch(setAnnouncements(newAnnouncements))
      })
    )
    return () => {
      subs.then(unsub => unsub()).catch(_ => null)
    }
  }, [])

  useEffect(() => {
    let cancel = false
    const func = async () => {
      while (!cancel) {
        try {
          await dispatch(getAnnouncementsAction())
          break
        } catch (error) {
          await new Promise(r => setTimeout(r, 5000))
        }
      }
    }
    func().catch(_ => null)
    return () => {
      cancel = true
    }
  }, [])

  return useMappedState((state: AppState) => state.contest.announcements)
}
