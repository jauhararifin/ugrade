import { Alignment, Button, H2, H5, H6, Intent, Tag } from '@blueprintjs/core'
import classnames from 'classnames'
import moment from 'moment'
import React, { FunctionComponent } from 'react'

import './styles.css'

import { ContestState } from '../../../stores/Contest'
import ContestSubmitForm from './ContestSubmitForm'
import SidebarMiniCard from './SidebarMiniCard'

export enum Menu {
  Overview = 'Overview',
  Announcements = 'Announcements',
  Problems = 'Problems',
  Clarifications = 'Clarifications',
  Submissions = 'Submissions',
  Scoreboard = 'Scoreboard',
}

export interface SidebarViewProps {
  contest: ContestState
  rank?: number
  serverClock?: Date
  menu?: Menu
  newAnnouncementCount: number
  newClarificationCount: number
  onChoose?: (menu: Menu) => any
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
  serverClock,
  rank,
  menu,
  onChoose,
  newAnnouncementCount,
  newClarificationCount,
}) => {
  const started =
    serverClock && contest.info && serverClock >= contest.info.startTime
  const ended =
    serverClock && contest.info && serverClock >= contest.info.finishTime
  const running = started && !ended
  const freezed = contest.info && contest.info.freezed
  const remainingTime =
    contest.info && serverClock
      ? moment.duration(
          moment(contest.info.finishTime).diff(moment(serverClock))
        )
      : undefined
  const remainingTimeStr = remainingTime
    ? durationToStr(remainingTime)
    : '--:--:--'
  const startedIn =
    contest.info && serverClock
      ? durationToStr(
          moment.duration(
            moment(contest.info.startTime).diff(moment(serverClock))
          )
        )
      : undefined

  const loading =
    !contest.info ||
    !serverClock ||
    (started && !contest.problems) ||
    !contest.info.permittedLanguages

  const skeletonClass = classnames({ 'bp3-skeleton': loading })

  const onMenuOverviewChoosed = onChoose
    ? () => onChoose(Menu.Overview)
    : () => null
  const onMenuAnnouncementsChoosed = onChoose
    ? () => onChoose(Menu.Announcements)
    : () => null
  const onMenuProblemsChoosed = onChoose
    ? () => onChoose(Menu.Problems)
    : () => null
  const onMenuClarificationsChoosed = onChoose
    ? () => onChoose(Menu.Clarifications)
    : () => null
  const onMenuSubmissionsChoosed = onChoose
    ? () => onChoose(Menu.Submissions)
    : () => null
  const onMenuScoreboardChoosed = onChoose
    ? () => onChoose(Menu.Scoreboard)
    : () => null

  return (
    <div className='contest-sidebar'>
      {!loading && contest.info ? (
        <H5>{contest.info.name}</H5>
      ) : (
        <H2 className='bp3-skeleton'>{'Fake'}</H2>
      )}
      <p className={skeletonClass} style={{ textAlign: 'left' }}>
        {contest.info && contest.info.shortDescription}
      </p>

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

      <div className={classnames(['contest-menu', skeletonClass])}>
        {loading ? (
          [0, 1, 2].map(i => <Button key={i} fill={true} text='Fake' />)
        ) : (
          <React.Fragment>
            <Button
              icon='home'
              onClick={onMenuOverviewChoosed}
              intent={menu === Menu.Overview ? Intent.PRIMARY : Intent.NONE}
              fill={true}
              minimal={true}
              alignText={Alignment.LEFT}
              disabled={!contest}
              text='Overview'
            />

            {started && (
              <Button
                icon='notifications'
                onClick={onMenuAnnouncementsChoosed}
                intent={
                  menu === Menu.Announcements ? Intent.PRIMARY : Intent.NONE
                }
                fill={true}
                minimal={true}
                alignText={Alignment.LEFT}
                disabled={!contest}
              >
                <div className='menu-item'>
                  <div className='menu-title'>Announcements</div>
                  {newAnnouncementCount > 0 && (
                    <div className='menu-tag'>
                      <Tag round={true} intent={Intent.SUCCESS}>
                        {newAnnouncementCount}
                      </Tag>
                    </div>
                  )}
                </div>
              </Button>
            )}

            {started && (
              <Button
                icon='book'
                onClick={onMenuProblemsChoosed}
                intent={menu === Menu.Problems ? Intent.PRIMARY : Intent.NONE}
                fill={true}
                minimal={true}
                alignText={Alignment.LEFT}
                disabled={!contest}
                text='Problems'
              />
            )}

            {started && (
              <Button
                icon='chat'
                onClick={onMenuClarificationsChoosed}
                intent={
                  menu === Menu.Clarifications ? Intent.PRIMARY : Intent.NONE
                }
                fill={true}
                minimal={true}
                alignText={Alignment.LEFT}
                disabled={!contest}
              >
                <div className='menu-item'>
                  <div className='menu-title'>Clarifications</div>
                  {newClarificationCount > 0 && (
                    <div className='menu-tag'>
                      <Tag round={true} intent={Intent.SUCCESS}>
                        {newClarificationCount}
                      </Tag>
                    </div>
                  )}
                </div>
              </Button>
            )}

            {started && (
              <Button
                icon='layers'
                onClick={onMenuSubmissionsChoosed}
                intent={
                  menu === Menu.Submissions ? Intent.PRIMARY : Intent.NONE
                }
                fill={true}
                minimal={true}
                alignText={Alignment.LEFT}
                disabled={!contest}
                text='Submissions'
              />
            )}

            {started && (
              <Button
                icon='th-list'
                onClick={onMenuScoreboardChoosed}
                intent={menu === Menu.Scoreboard ? Intent.PRIMARY : Intent.NONE}
                fill={true}
                minimal={true}
                alignText={Alignment.LEFT}
                disabled={!contest}
                text='Scoreboard'
              />
            )}
          </React.Fragment>
        )}
      </div>

      <div className='contest-submit-solution'>
        <ContestSubmitForm />
      </div>
    </div>
  )
}
