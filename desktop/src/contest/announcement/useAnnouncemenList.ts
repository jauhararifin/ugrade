import { useMappedState } from 'redux-react-hook'
import { getAnnouncementList } from '../store'
import { useAnnouncements } from './useAnnouncements'

export function useAnnouncementList() {
  useAnnouncements()
  return useMappedState(getAnnouncementList)
}
