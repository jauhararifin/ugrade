import { EditableText, H2, H5, H6 } from '@blueprintjs/core'
import classnames from 'classnames'
import moment from 'moment'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { ContestInfo } from '../../../contest'
import { ContestSubmitForm } from './ContestSubmitForm'
import { SidebarMenus } from './SidebarMenus'
import { SidebarMiniCard } from './SidebarMiniCard'

import './styles.css'

export enum Menu {
  Overview = 'Overview',
  Announcements = 'Announcements',
  Problems = 'Problems',
  Clarifications = 'Clarifications',
  Submissions = 'Submissions',
  Scoreboard = 'Scoreboard',
}

export interface SidebarViewProps {
  contest: ContestInfo
  canUpdateInfo: boolean
  serverClock: Date
  onUpdateName: (newName: string) => any
  onUpdateShortDesc: (newShortDesc: string) => any
}

const durationToStr = (duration: moment.Duration | number): string => {
  const rtime = moment.duration(duration)
  const pad = (x: number): string => (x < 10 ? `0${x.toString()}` : x.toString())
  return rtime.asDays() > 1 ? rtime.humanize() : `${pad(rtime.hours())}:${pad(rtime.minutes())}:${pad(rtime.seconds())}`
}

export const SidebarView: FunctionComponent<SidebarViewProps> = ({
  contest,
  serverClock,
  canUpdateInfo,
  onUpdateName,
  onUpdateShortDesc,
}) => {
  const started = serverClock && contest && serverClock >= contest.startTime
  const ended = serverClock && contest && serverClock >= contest.finishTime
  const running = started && !ended
  const freezed = contest && contest.freezed
  const remainingTime =
    contest && serverClock ? moment.duration(moment(contest.finishTime).diff(moment(serverClock))) : undefined
  const remainingTimeStr = remainingTime ? durationToStr(remainingTime) : '--:--:--'
  const startedIn =
    contest && serverClock
      ? durationToStr(moment.duration(moment(contest.startTime).diff(moment(serverClock))))
      : undefined

  const [name, setName] = useState('')
  const [shortDesc, setShortDesc] = useState('')
  useEffect(() => {
    if (contest) {
      setName(contest.name)
      setShortDesc(contest.shortDescription)
    }
  }, [contest && contest.name, contest && contest.shortDescription])

  const renderName = () => {
    if (canUpdateInfo) {
      return (
        <H5>
          <EditableText
            maxLength={128}
            placeholder='Contest Title'
            onChange={setName}
            value={name}
            multiline={true}
            onConfirm={onUpdateName}
          />
        </H5>
      )
    } else {
      return <H5>{contest.name}</H5>
    }
  }

  const renderShortDesc = () => {
    if (canUpdateInfo) {
      return (
        <EditableText
          maxLength={256}
          className='short-description'
          placeholder='Contest Short Description'
          onChange={setShortDesc}
          value={shortDesc}
          multiline={true}
          onConfirm={onUpdateShortDesc}
        />
      )
    } else {
      return <p>{contest.shortDescription}</p>
    }
  }

  return (
    <div className='contest-sidebar'>
      {renderName()}
      {renderShortDesc()}

      <div className='contest-status-bottom'>
        {(() => {
          if (!started) {
            return (
              <SidebarMiniCard className='contest-status-time'>
                <H6>Started In</H6>
                <H2>{startedIn}</H2>
              </SidebarMiniCard>
            )
          } else if (running) {
            return (
              <SidebarMiniCard className={classnames('contest-status-time')}>
                <H6>Remaining Time</H6>
                <H2>{remainingTimeStr}</H2>
              </SidebarMiniCard>
            )
          } else if (ended) {
            return (
              <React.Fragment>
                <SidebarMiniCard className='contest-status-time'>
                  <H2>Contest Ended</H2>
                </SidebarMiniCard>
              </React.Fragment>
            )
          }
        })()}
      </div>

      <div className='contest-menu'>
        <SidebarMenus loading={false} />
      </div>
      <div className='contest-submit-solution'>
        <ContestSubmitForm />
      </div>
    </div>
  )
}
