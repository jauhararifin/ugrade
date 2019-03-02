import { Classes, H1, HTMLTable, Tooltip } from '@blueprintjs/core'
import classnames from 'classnames'
import React, { FunctionComponent } from 'react'
import { Problem, Scoreboard } from 'ugrade/contest/store'

import { User } from 'ugrade/auth/store'
import './styles.scss'

export interface ScoreboardViewProps {
  problems?: Problem[]
  scoreboard?: Scoreboard
  userMap: { [id: string]: User }
}

export const ScoreboardView: FunctionComponent<ScoreboardViewProps> = ({
  problems,
  scoreboard,
  userMap,
}) => {
  if (!problems || !scoreboard) {
    return (
      <div className='contest-scoreboard'>
        <H1 className='bp3-skeleton'>Scoreboard</H1>
        <div className='bp3-skeleton'>{'lorem ipsum'.repeat(100)}</div>
      </div>
    )
  }

  scoreboard.entries = scoreboard.entries.sort((a, b) => a.rank - b.rank)

  return (
    <div className='contest-scoreboard'>
      <H1>Scoreboard</H1>
      <div>
        <HTMLTable
          bordered={true}
          striped={true}
          interactive={true}
          className='scoreboard-table'
        >
          <thead>
            <tr>
              <th className='rank'>#</th>
              <th>Contestant</th>
              <th className='score'>Score</th>
              {problems.map(problem => (
                <th key={problem.id} className='problem-column'>
                  <Tooltip
                    className={Classes.TOOLTIP_INDICATOR}
                    content={problem.name}
                  >
                    <a>{problem.shortId}</a>
                  </Tooltip>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scoreboard.entries
              .sort((a, b) => a.rank - b.rank)
              .map(entry => (
                <tr key={entry.contestant}>
                  <td className='rank'>{entry.rank}</td>
                  <td>
                    <Tooltip
                      className={Classes.TOOLTIP_INDICATOR}
                      content={entry.contestant}
                    >
                      {userMap[entry.contestant]
                        ? userMap[entry.contestant].name
                        : entry.contestant}
                    </Tooltip>
                  </td>

                  <td className='score'>
                    <div className='attempt'>{entry.totalPassed}</div>
                    <div className='penalty'>{entry.totalPenalty}</div>
                  </td>

                  {problems.map(problem => {
                    const problemId = problem.id
                    const problemScore = entry.problemScores[problemId]
                    const {
                      attempt,
                      penalty,
                      frozen,
                      first,
                      passed,
                    } = problemScore || {
                      attempt: 0,
                      penalty: 0,
                      frozen: false,
                      first: false,
                      passed: false,
                    }

                    const classes = classnames('problem-column', {
                      passed,
                      failed: attempt > 0 && !passed && !frozen,
                      'first-passed': first,
                      frozed: attempt > 0 && frozen,
                    })

                    return (
                      <td key={problemId} className={classes}>
                        <div className='attempt'>{attempt}</div>
                        {penalty && <div className='penalty'>{penalty}</div>}
                      </td>
                    )
                  })}
                </tr>
              ))}
          </tbody>
        </HTMLTable>
      </div>
    </div>
  )
}
