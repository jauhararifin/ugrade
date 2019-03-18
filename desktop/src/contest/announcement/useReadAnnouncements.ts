import { useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/store'
import { readAnnouncements } from '../store'

export const readAnnouncementsAction = (ids: string[]): AppThunkAction => {
  return async (dispatch, getState, { announcementService }) => {
    const token = getState().auth.token
    await announcementService.readAnnouncements(token, ids)
    const stillRelevant = getState().auth.token === token
    if (stillRelevant) dispatch(readAnnouncements(ids))
  }
}

export function useReadAnnouncements() {
  const dispatch = useAppThunkDispatch()
  return (ids: string[]) => dispatch(readAnnouncementsAction(ids))
}
