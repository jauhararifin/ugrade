import { Classes, HTMLTable, Tooltip } from '@blueprintjs/core'
import classnames from 'classnames'
import React, { FunctionComponent } from 'react'
import { UserLink } from 'ugrade/auth/components'
import { Problem, Scoreboard } from 'ugrade/contest/store'
import { ContentWithHeader } from '../components/ContentWithHeader'

import './styles.scss'

export interface ScoreboardViewProps {
  problems: Problem[]
  scoreboard: Scoreboard
}

export const ScoreboardView: FunctionComponent<ScoreboardViewProps> = ({
  problems,
  scoreboard,
}) => {
  scoreboard.entries = scoreboard.entries.sort((a, b) => a.rank - b.rank)

  return (
    <ContentWithHeader className='contest-scoreboard' header='Scoreboard'>
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
                  <UserLink username={entry.contestant} />
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
                    freezed,
                    first,
                    passed,
                  } = problemScore || {
                    attempt: 0,
                    penalty: 0,
                    freezed: false,
                    first: false,
                    passed: false,
                  }

                  const classes = classnames('problem-column', {
                    passed,
                    failed: attempt > 0 && !passed && !freezed,
                    'first-passed': first,
                    frozed: attempt > 0 && freezed,
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
    </ContentWithHeader>
  )
}
