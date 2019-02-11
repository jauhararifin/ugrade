import { H4, H6, HTMLTable } from '@blueprintjs/core'
import moment from 'moment'
import React from 'react'

import './styles.css'

import { Contest } from '../../stores/Contest'

export interface ContestsListProps {
  contests: Contest[]
  onContestChoose?: (contest: Contest) => any
}

export const ContestsList: React.FunctionComponent<ContestsListProps> = ({
  contests,
  onContestChoose,
}) => {
  if (contests.length === 0) {
    return (
      <div className='contests-contests-group skeleton'>
        <H4 className='contests-contests-title bp3-skeleton'>
          Active Contests
        </H4>
        <HTMLTable
          bordered={true}
          striped={true}
          interactive={true}
          className='contests-contests-table bp3-skeleton'
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Short Description</th>
              <th>Start</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody />
        </HTMLTable>
      </div>
    )
  }

  const currentDate = new Date()
  const activeContests = contests
    .slice()
    .filter(
      contest =>
        currentDate >= contest.startTime && currentDate < contest.finishTime
    )
  const upcomingContests = contests
    .slice()
    .filter(contest => currentDate < contest.startTime)
  const pastContests = contests
    .slice()
    .filter(contest => currentDate >= contest.finishTime)

  const createChooseHandler = (contest: Contest) => {
    if (onContestChoose) {
      return () => {
        onContestChoose(contest)
      }
    }
    return () => null
  }

  const renderContestsList = (title: string, contestsList: Contest[]) => (
    <div className='contests-contests-group'>
      <H4 className='contests-contests-title'>{title}</H4>
      <HTMLTable
        bordered={true}
        striped={true}
        interactive={true}
        className='contests-contests-table'
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Short Description</th>
            <th>Start</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {contestsList.length === 0 && (
            <tr>
              <td colSpan={4}>No Contests</td>
            </tr>
          )}
          {contestsList.length > 0 &&
            contestsList.map(contest => (
              <tr key={contest.id} onClick={createChooseHandler(contest)}>
                <td>
                  <H6>{contest.name}</H6>
                </td>
                <td>
                  <p>{contest.shortDescription}</p>
                </td>
                <td>
                  {moment(contest.startTime).format('MMMM Do YYYY, h:mm:ss a')}
                </td>
                <td>
                  {moment
                    .duration(
                      contest.finishTime.getTime() - contest.startTime.getTime()
                    )
                    .humanize()}
                </td>
              </tr>
            ))}
        </tbody>
      </HTMLTable>
    </div>
  )

  return (
    <React.Fragment>
      {renderContestsList('Active Contests', activeContests)}
      {renderContestsList('Upcoming Contests', upcomingContests)}
      {renderContestsList('Past Contests', pastContests)}
    </React.Fragment>
  )
}
