import { Classes, H1, HTMLTable, Tooltip } from '@blueprintjs/core'
import classnames from 'classnames'
import React, { FunctionComponent } from 'react'

import './styles.scss'

export interface IProblem {
  id: number
  name: string
  shortName: string
}

export interface IProblemScore {
  attempts: number
  penalty?: number
  firstPassed: boolean
  frozen: boolean
}

export interface IScoreboardEntry {
  rank: number
  username: string
  displayName: string
  passed: number
  penalty: number
  scores: IProblemScore[]
}

export interface ScoreboardViewProps {
  problems: IProblem[]
  entries: IScoreboardEntry[]
}

export const ScoreboardView: FunctionComponent<ScoreboardViewProps> = ({
  problems,
  entries,
}) => (
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
                  <a>{problem.shortName}</a>
                </Tooltip>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map(entry => (
            <tr>
              <td className='rank'>{entry.rank}</td>
              <td>
                <Tooltip
                  className={Classes.TOOLTIP_INDICATOR}
                  content={entry.username}
                >
                  {entry.displayName}
                </Tooltip>
              </td>

              <td className='score'>
                <div className='attempt'>{entry.rank}</div>
                <div className='penalty'>{entry.penalty}</div>
              </td>

              {entry.scores.map((score, i) => {
                const { attempts, penalty, frozen, firstPassed } = score
                const classes = classnames('problem-column', {
                  passed: attempts > 0 && !!penalty && !frozen,
                  failed: attempts > 0 && !penalty && !frozen,
                  'first-passed':
                    attempts > 0 && !!penalty && !frozen && firstPassed,
                  frozed: attempts > 0 && frozen,
                })
                return (
                  <td key={i} className={classes}>
                    <div className='attempt'>{score.attempts}</div>
                    {score.penalty && (
                      <div className='penalty'>{score.penalty}</div>
                    )}
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
