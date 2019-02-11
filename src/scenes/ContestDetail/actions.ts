import { Announcement } from '../../services/contest/Announcement'
import { AppThunkAction } from '../../stores'
import { setCurrentContestAnnouncements } from '../../stores/Contest'

export const getContestAnnouncement = (
  id: number
): AppThunkAction<Announcement[]> => {
  return async (dispatch, _, { contestService }) => {
    const announcements = await contestService.getAccouncementsByContestId(id)
    dispatch(setCurrentContestAnnouncements(id, announcements))
    return announcements
  }
}
