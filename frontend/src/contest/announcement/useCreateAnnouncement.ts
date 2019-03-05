import { useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/store'
import { setAnnouncements } from '../store'

export function createAnnouncementAction(
  title: string,
  content: string
): AppThunkAction {
  return async (dispatch, getState, { announcementService }) => {
    const token = getState().auth.token
    const announcement = await announcementService.createAnnouncement(
      token,
      title,
      content
    )
    const stillRelevant = getState().auth.token === token
    if (stillRelevant) dispatch(setAnnouncements([announcement]))
  }
}

export function useCreateAnnouncement() {
  const dispatch = useAppThunkDispatch()
  return (title: string, content: string) =>
    dispatch(createAnnouncementAction(title, content))
}
