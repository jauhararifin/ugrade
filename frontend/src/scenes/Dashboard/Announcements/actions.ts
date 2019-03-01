import { readAnnouncements } from 'ugrade/contest/store'
import { AppThunkAction } from 'ugrade/store'

export const readAnnouncementsAction = (ids: string[]): AppThunkAction => {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    await contestService.readAnnouncements(token, ids)
    const stillRelevant = getState().auth.token === token
    if (stillRelevant) dispatch(readAnnouncements(ids))
  }
}
