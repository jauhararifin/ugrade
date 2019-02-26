import { useState } from 'react'

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

export async function useAnnouncements(dispatch: AppThunkDispatch) {
  const [started, setStarted] = useState(false)
  if (!started) {
    setStarted(true)
    await dispatch(getAnnouncementsAction())
  }
}
