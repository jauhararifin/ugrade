import { EditableText, H2, H5, H6 } from '@blueprintjs/core'
import classnames from 'classnames'
import moment from 'moment'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { ContestInfo, Problem } from 'ugrade/contest/store'
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
  contest?: ContestInfo
  problems?: Problem[]
  rank?: number
  canUpdateInfo: boolean
  serverClock?: Date
  onUpdateName: (newName: string) => any
  onUpdateShortDesc: (newShortDesc: string) => any
}

const durationToStr = (duration: moment.Duration | number): string => {
  const rtime = moment.duration(duration)
  const pad = (x: number): string =>
    x < 10 ? `0${x.toString()}` : x.toString()
  return rtime.asDays() > 1
    ? rtime.humanize()
    : `${pad(rtime.hours())}:${pad(rtime.minutes())}:${pad(rtime.seconds())}`
}

export const SidebarView: FunctionComponent<SidebarViewProps> = ({
  contest,
  problems,
  serverClock,
  rank,
  canUpdateInfo,
  onUpdateName,
  onUpdateShortDesc,
}) => {
  const started = serverClock && contest && serverClock >= contest.startTime
  const ended = serverClock && contest && serverClock >= contest.finishTime
  const running = started && !ended
  const freezed = contest && contest.freezed
  const remainingTime =
    contest && serverClock
      ? moment.duration(moment(contest.finishTime).diff(moment(serverClock)))
      : undefined
  const remainingTimeStr = remainingTime
    ? durationToStr(remainingTime)
    : '--:--:--'
  const startedIn =
    contest && serverClock
      ? durationToStr(
          moment.duration(moment(contest.startTime).diff(moment(serverClock)))
        )
      : undefined

  const loading =
    !contest ||
    !serverClock ||
    (started && !problems) ||
    !contest.permittedLanguages

  const skeletonClass = classnames({ 'bp3-skeleton': loading })

  const [name, setName] = useState('')
  const [shortDesc, setShortDesc] = useState('')
  useEffect(() => {
    if (contest) {
      setName(contest.name)
      setShortDesc(contest.shortDescription)
    }
  }, [contest && contest.name, contest && contest.shortDescription])

  const renderName = () => {
    if (!loading && contest) {
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
    } else {
      return <H2 className='bp3-skeleton'>{'Fake'}</H2>
    }
  }

  const renderShortDesc = () => {
    if (!loading && contest) {
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
    } else {
      return <p className='bp3-skeleton'>{'fake '.repeat(50)}</p>
    }
  }

  return (
    <div className='contest-sidebar'>
      {renderName()}
      {renderShortDesc()}

      <div className='contest-status-bottom'>
        {(() => {
          if (loading) {
            return (
              <React.Fragment>
                <SidebarMiniCard
                  className={classnames(skeletonClass, 'contest-status-rank', {
                    freezed,
                  })}
                >
                  <H6>Rank</H6>
                  <H2>Fake</H2>
                </SidebarMiniCard>
                <SidebarMiniCard
                  className={classnames(skeletonClass, 'contest-status-time')}
                >
                  <H6>Remaining Time</H6>
                  <H2>Fake Fake</H2>
                </SidebarMiniCard>
              </React.Fragment>
            )
          } else if (!started) {
            return (
              <SidebarMiniCard
                className={classnames(skeletonClass, 'contest-status-time')}
              >
                <H6>Started In</H6>
                <H2>{startedIn}</H2>
              </SidebarMiniCard>
            )
          } else if (running) {
            return (
              <React.Fragment>
                <SidebarMiniCard
                  className={classnames(skeletonClass, 'contest-status-rank', {
                    freezed,
                  })}
                >
                  <H6>Rank</H6>
                  <H2>{contest && rank ? rank : '-'}</H2>
                </SidebarMiniCard>
                <SidebarMiniCard
                  className={classnames(skeletonClass, 'contest-status-time')}
                >
                  <H6>Remaining Time</H6>
                  <H2>{remainingTimeStr}</H2>
                </SidebarMiniCard>
              </React.Fragment>
            )
          } else if (ended) {
            return (
              <React.Fragment>
                <SidebarMiniCard
                  className={classnames(skeletonClass, 'contest-status-rank', {
                    freezed,
                  })}
                >
                  <H6>Rank</H6>
                  <H2>{contest && rank ? rank : '-'}</H2>
                </SidebarMiniCard>
                <SidebarMiniCard
                  className={classnames(skeletonClass, 'contest-status-time')}
                >
                  <H2>Contest Ended</H2>
                </SidebarMiniCard>
              </React.Fragment>
            )
          }
        })()}
      </div>

      <SidebarMenus loading={loading} />

      <div className='contest-submit-solution'>
        <ContestSubmitForm />
      </div>
    </div>
  )
}
