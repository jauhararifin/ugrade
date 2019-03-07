import React, { FunctionComponent, useEffect } from 'react'
import { useContestOnly, usePermissions } from 'ugrade/auth'
import { UserPermission } from 'ugrade/auth/store'
import { globalErrorCatcher } from 'ugrade/common'
import {
  useAnnouncementList,
  useReadAnnouncements,
} from 'ugrade/contest/announcement'
import { Announcement } from 'ugrade/contest/store'
import { useServerClock } from 'ugrade/server'
import { AnnouncementsLoadingView } from './AnnouncementsLoadingView'
import { AnnouncementsView } from './AnnouncementsView'

export const Announcements: FunctionComponent = () => {
  useContestOnly()

  const announcementList = useAnnouncementList()
  const serverClock = useServerClock(60 * 1000)
  const readAnnouncements = useReadAnnouncements()

  const readAllAnnouncements = async () => {
    if (announcementList) {
      await new Promise(resolve => setTimeout(resolve, 2000)) // read after 2 seconds
      const unReads = announcementList
        .filter(ann => !ann.read)
        .map(ann => ann.id)
      if (unReads.length > 0) {
        await readAnnouncements(unReads)
      }
    }
  }

  useEffect(() => {
    readAllAnnouncements().catch(globalErrorCatcher)
  }, [announcementList])

  const canCreate = usePermissions([UserPermission.AnnouncementCreate])

  const loading = !announcementList || !serverClock
  if (loading) return <AnnouncementsLoadingView />

  return (
    <AnnouncementsView
      canCreate={canCreate}
      announcements={announcementList as Announcement[]}
      serverClock={serverClock as Date}
    />
  )
}
