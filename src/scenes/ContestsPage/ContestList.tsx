import React from 'react'
import { H4, HTMLTable, H6 } from '@blueprintjs/core'
import moment from 'moment'

import "./styles.css"

import { Contest } from '../../stores/Contest'

export interface ContestListProps {
    contests: Contest[],
    onContestChoose?: (id: number) => any
}

export const ContestList: React.SFC<ContestListProps> = ({ contests, onContestChoose }) => {
    if (contests.length === 0) {
        return (
            <div className="contests-contests-group skeleton">
              <H4 className="contests-contests-title bp3-skeleton">Active Contests</H4>
              <HTMLTable bordered striped interactive className="contests-contests-table bp3-skeleton">
                <thead>
                  <th>Name</th>
                  <th>Short Description</th>
                  <th>Start</th>
                  <th>Duration</th>
                </thead>
                <tbody>
                </tbody>
              </HTMLTable>
            </div>
        )
    }

    const currentDate = new Date()
    const activeContests = contests.slice().filter(contest => currentDate >= contest.startTime && currentDate < contest.finishTime)
    const upcomingContests = contests.slice().filter(contest => currentDate < contest.startTime)
    const pastContests = contests.slice().filter(contest => currentDate >= contest.finishTime)

    const createChooseHandler = (id: number) => {
        if (onContestChoose) {
            return () => { onContestChoose(id) }
        }
        return () => {}
    }

    const renderContestList = (title: string, contests: Contest[]) => (
        <div className="contests-contests-group">
            <H4 className="contests-contests-title">{title}</H4>
            <HTMLTable bordered striped interactive className="contests-contests-table">
                <thead>
                    <th>Name</th>
                    <th>Short Description</th>
                    <th>Start</th>
                    <th>Duration</th>
                </thead>
                <tbody>
                    { contests.length === 0 && <tr><td colSpan={4}>No Contests</td></tr>}
                    { contests.length > 0 && contests.map(contest => (
                        <tr key={contest.id} onClick={createChooseHandler(contest.id)}>
                            <td><H6>{contest.name}</H6></td>
                            <td><p>{contest.shortDescription}</p></td>
                            <td>{moment(contest.startTime).format("MMMM Do YYYY, h:mm:ss a")}</td>
                            <td>{moment.duration(contest.finishTime.getTime() - contest.startTime.getTime()).humanize()}</td>
                        </tr>
                    ))}
                    
                </tbody>
            </HTMLTable>
        </div>
    )

    return (
        <React.Fragment>
            { renderContestList("Active Contests", activeContests) }
            { renderContestList("Upcoming Contests", upcomingContests) }
            { renderContestList("Past Contests", pastContests) }
        </React.Fragment>
    )
}