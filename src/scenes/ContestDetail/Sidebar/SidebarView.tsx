import { Alignment, Button, H2, H5, H6, Intent } from '@blueprintjs/core'
import classnames from 'classnames'
import moment from 'moment'
import React, { SFC } from 'react'

import './styles.css'

import SidebarMiniCard from '../../../components/SidebarMiniCard'
import { Contest } from '../../../stores/Contest'
import ContestSubmitForm from './ContestSubmitForm'

export enum Menu {
  Overview = 'Overview',
  Announcements = 'Announcements',
  Problems = 'Problems',
  Clarifications = 'Clarifications',
  Submissions = 'Submissions',
  Scoreboard = 'Scoreboard',
}

export interface SidebarViewProps {
  contest?: Contest
  rank?: number
  serverClock?: Date
  menu?: Menu
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

export const SidebarView: SFC<SidebarViewProps> = ({
  contest,
  serverClock,
  rank,
  menu,
  onChoose,
}) => {
  const loading = !contest || !serverClock
  const participated = contest && contest.registered
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
    <div className='contests-navigation'>
      {!loading && contest ? (
        <H5>{contest.name}</H5>
      ) : (
        <H2 className='bp3-skeleton'>{'Fake'}</H2>
      )}
      <p className={skeletonClass} style={{ textAlign: 'left' }}>
        {contest && contest.shortDescription}
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
                {participated && (
                  <SidebarMiniCard
                    className={classnames(
                      skeletonClass,
                      'contest-status-rank',
                      { freezed }
                    )}
                  >
                    <H6>Rank</H6>
                    <H2>{contest && rank ? rank : '-'}</H2>
                  </SidebarMiniCard>
                )}
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
                {participated && (
                  <SidebarMiniCard
                    className={classnames(
                      skeletonClass,
                      'contest-status-rank',
                      { freezed }
                    )}
                  >
                    <H6>Rank</H6>
                    <H2>{contest && rank ? rank : '-'}</H2>
                  </SidebarMiniCard>
                )}
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
                text='Announcements'
              />
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

            {participated && started && (
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
                text='Clarifications'
              />
            )}

            {participated && started && (
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

      <div className={classnames(skeletonClass, 'contest-submit-solution')}>
        {loading ? (
          <ContestSubmitForm />
        ) : (
          participated && started && <ContestSubmitForm />
        )}
      </div>

      <div className={classnames(skeletonClass, 'contest-registration')}>
        {loading ? (
          <Button text='Fake' />
        ) : (
          !participated &&
          !started && (
            <Button
              fill={true}
              disabled={!contest}
              intent={Intent.PRIMARY}
              text='Register'
            />
          )
        )}
      </div>
    </div>
  )
}