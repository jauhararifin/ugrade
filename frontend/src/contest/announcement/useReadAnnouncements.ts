import { useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/store'
import { readAnnouncements } from '../store'

export const readAnnouncementsAction = (ids: string[]): AppThunkAction => {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    await contestService.readAnnouncements(token, ids)
    const stillRelevant = getState().auth.token === token
    if (stillRelevant) dispatch(readAnnouncements(ids))
  }
}

export function useReadAnnouncements() {
  const dispatch = useAppThunkDispatch()
  return (ids: string[]) => dispatch(readAnnouncementsAction(ids))
}
