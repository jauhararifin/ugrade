import { Card, Classes, H1, H3, HTMLTable, Tooltip } from '@blueprintjs/core'
import classnames from 'classnames'
import 'github-markdown-css'
import moment from 'moment'
import React, { FunctionComponent } from 'react'

import './styles.css'

import { Submission } from '../../../stores/Contest'

export interface SubmissionsViewProps {
  submissions?: Submission[]
  serverClock?: Date
}

export const SubmissionsView: FunctionComponent<SubmissionsViewProps> = ({
  submissions,
  serverClock,
}) => {
  const loading = !submissions || !serverClock
  const currentMoment = moment(serverClock || new Date())
  return (
    <div className='contest-submissions'>
      <H1 className={classnames('header', { 'bp3-skeleton': loading })}>
        Submissions
      </H1>
      <div>
        {loading ? (
          <Card className='bp3-skeleton item'>{'lorem ipsum'.repeat(100)}</Card>
        ) : (
          <HTMLTable
            bordered={true}
            striped={true}
            interactive={true}
            className='submissions-table'
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Time</th>
                <th>Problem</th>
                <th>Language</th>
                <th>Verdict</th>
              </tr>
            </thead>
            <tbody>
              {submissions && submissions.length === 0 && (
                <tr>
                  <td colSpan={5}>No Submissions Yet</td>
                </tr>
              )}
              {submissions &&
                submissions.map(submission => (
                  <tr key={submission.id}>
                    <td>{submission.id}</td>
                    <td>
                      <Tooltip
                        className={Classes.TOOLTIP_INDICATOR}
                        content={moment(submission.issuedTime).format(
                          'dddd, MMMM Do YYYY, h:mm:ss a'
                        )}
                      >
                        {moment(submission.issuedTime).from(currentMoment)}
                      </Tooltip>
                    </td>
                    <td>{submission.problemId}</td>
                    <td>{submission.languageId}</td>
                    <td>{submission.verdict}</td>
                  </tr>
                ))}
            </tbody>
          </HTMLTable>
        )}
      </div>
    </div>
  )
}

export default SubmissionsView
