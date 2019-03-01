import React, { FunctionComponent, useEffect } from 'react'
import { useContestOnly } from 'ugrade/auth'
import {
  useAnnouncementList,
  useReadAnnouncements,
} from 'ugrade/contest/announcement'
import { useServerClock } from 'ugrade/server'
import { AnnouncementsView } from './AnnouncementsView'

export const Announcements: FunctionComponent = () => {
  useContestOnly()

  const announcementList = useAnnouncementList()
  const serverClock = useServerClock()
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
    readAllAnnouncements().catch(_ => null)
  }, [announcementList])

  return (
    <AnnouncementsView
      announcements={announcementList}
      serverClock={serverClock}
    />
  )
}
