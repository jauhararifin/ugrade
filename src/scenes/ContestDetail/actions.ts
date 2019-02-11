import { Announcement } from '../../services/contest/Announcement'
import {
  AnnouncementSubscribeCallback,
  AnnouncementUbsubscribeFunction,
} from '../../services/contest/ContestService'
import { AppThunkAction } from '../../stores'
import {
  Contest,
  readAnnouncements,
  setCurrentContest,
  setCurrentContestAnnouncements,
} from '../../stores/Contest'

export const getContestById = (id: number): AppThunkAction<Contest> => {
  return async (dispatch, _getState, { contestService }) => {
    const contest = await contestService.getContestById(id)
    dispatch(setCurrentContest(contest))
    return contest
  }
}

export const subscribeContestAnnouncements = (
  contest: Contest,
  callback: AnnouncementSubscribeCallback
): AppThunkAction<AnnouncementUbsubscribeFunction> => {
  return async (_dispatch, _getState, { contestService }) => {
    return contestService.subscribeAnnouncements(contest.id, callback)
  }
}

export const getContestAnnouncement = (
  id: number
): AppThunkAction<Announcement[]> => {
  return async (dispatch, _getState, { contestService }) => {
    const announcements = await contestService.getAccouncementsByContestId(id)
    dispatch(setCurrentContestAnnouncements(id, announcements))
    return announcements
  }
}

export const readAnnouncementsAction = (
  ids: number[]
): AppThunkAction<void> => {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    await contestService.readAnnouncements(token, ids)
    dispatch(readAnnouncements(ids))
  }
}
