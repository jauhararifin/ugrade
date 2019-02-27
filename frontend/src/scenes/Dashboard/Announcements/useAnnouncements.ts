import { useEffect, useState } from 'react'

import {
  AnnouncementSubscribeCallback,
  AnnouncementUbsubscribeFunction,
} from '../../../services/contest/ContestService'
import { AppThunkAction, AppThunkDispatch } from '../../../stores'
import { Announcement, setAnnouncements } from '../../../stores/Contest'

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

export async function useAnnouncements(dispatch: AppThunkDispatch) {
  const [started, setStarted] = useState(false)

  // useEffect(() => {
  //   const subs = dispatch(
  //     subscribeAnnouncementsAction(newAnnouncements => {
  //       dispatch(setAnnouncements(newAnnouncements))
  //     })
  //   )
  //   return () => {
  //     subs.then(unsub => {
  //       unsub()
  //     })
  //   }
  // })

  if (!started) {
    setStarted(true)
    await dispatch(getAnnouncementsAction())
  }
}
