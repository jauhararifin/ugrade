import { Card, Classes, Elevation, H1, H3, Tooltip } from '@blueprintjs/core'
import classnames from 'classnames'
import moment from 'moment'
import React, { FunctionComponent } from 'react'
import ReactMarkdown from 'react-markdown'
import { Announcement } from 'ugrade/contest/store'

import 'github-markdown-css'
import './styles.css'

export interface AnnouncementsViewProps {
  announcements?: Announcement[]
  serverClock?: Date
}

export const AnnouncementsView: FunctionComponent<AnnouncementsViewProps> = ({
  announcements,
  serverClock,
}) => {
  const loading = !announcements
  const currentMoment = moment(serverClock || new Date())
  return (
    <div className='contest-announcements'>
      <H1 className={classnames('header', { 'bp3-skeleton': loading })}>
        Announcements
      </H1>
      <div>
        {loading && (
          <Card className='bp3-skeleton item'>{'lorem ipsum'.repeat(100)}</Card>
        )}

        {announcements && announcements.length === 0 && (
          <H3>No Announcements Yet</H3>
        )}

        {announcements &&
          announcements
            .slice()
            .reverse()
            .map(announcement => (
              <Card
                key={announcement.id}
                className='item'
                elevation={announcement.read ? Elevation.ZERO : Elevation.TWO}
              >
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
                <ReactMarkdown source={announcement.content} />
              </Card>
            ))}
      </div>
    </div>
  )
}

export default AnnouncementsView
