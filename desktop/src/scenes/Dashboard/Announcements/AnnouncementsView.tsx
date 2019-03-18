import { Card, Classes, H3, Icon, Intent, Tooltip } from '@blueprintjs/core'
import classnames from 'classnames'
import moment from 'moment'
import React, { FunctionComponent } from 'react'
import { Markdown } from 'ugrade/components'
import { Announcement } from 'ugrade/contest/store'
import { ContentWithHeader } from '../components/ContentWithHeader'
import { CreateAnnouncementForm } from './CreateAnnouncementForm'

import 'github-markdown-css'
import './styles.css'

export interface AnnouncementsViewProps {
  announcements: Announcement[]
  serverClock: Date
  canCreate: boolean
}

export const AnnouncementsView: FunctionComponent<AnnouncementsViewProps> = ({
  announcements,
  serverClock,
  canCreate,
}) => {
  const currentMoment = moment(serverClock || new Date())

  const renderAnnouncement = (announcement: Announcement) => (
    <Card
      key={announcement.id}
      className={classnames('item', { unread: !announcement.read })}
    >
      <div className='unread-indicator'>
        <Icon icon='full-circle' intent={Intent.PRIMARY} />
      </div>
      <div className='content'>
        <div className='header'>
          <H3 className='title'>{announcement.title}</H3>
          <p className='info'>
            <Tooltip
              className={Classes.TOOLTIP_INDICATOR}
              content={moment(announcement.issuedTime).format(
                'dddd, MMMM Do YYYY, h:mm:ss a'
              )}
            >
              {moment(announcement.issuedTime).from(currentMoment)}
            </Tooltip>
          </p>
        </div>
        <Markdown source={announcement.content} />
      </div>
    </Card>
  )

  return (
    <ContentWithHeader className='contest-announcements' header='Announcements'>
      {canCreate && <CreateAnnouncementForm />}
      <div>
        {announcements.length === 0 && <H3>No Announcements Yet</H3>}
        {announcements
          .slice()
          .reverse()
          .map(renderAnnouncement)}
      </div>
    </ContentWithHeader>
  )
}
