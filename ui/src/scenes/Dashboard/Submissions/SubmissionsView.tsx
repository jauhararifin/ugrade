import { Classes, HTMLTable, Tooltip } from '@blueprintjs/core'
import 'github-markdown-css'
import moment from 'moment'
import React, { FunctionComponent, useState } from 'react'
import { Link } from 'react-router-dom'
import { ContentWithHeader } from '../components/ContentWithHeader/ContentWithHeader'
import { SubmissionDetail } from './SubmissionDetail/SubmissionDetail'
import { Verdict } from './Verdict/Verdict'

import './styles.css'

interface Submission {
  id: string
  issuedTime: Date
  sourceCode: string
  problem: {
    id: string
    name: string
  }
  language: {
    id: string
    name: string
  }
  verdict: string
}

export interface SubmissionsViewProps {
  submissions: Submission[]
  serverClock: Date
}

export interface SubmissionViewState {
  currentSubmission?: Submission
}

export const SubmissionsView: FunctionComponent<SubmissionsViewProps> = ({ submissions, serverClock }) => {
  const [currSubmission, setCurrSubmission] = useState(undefined as Submission | undefined)
  const genhandleClose = () => () => setCurrSubmission(undefined)
  const genhandleClick = (submission: Submission) => () => setCurrSubmission(submission)

  const currentMoment = moment(serverClock)
  return (
    <ContentWithHeader className='contest-submissions' header='Submissions'>
      {serverClock && currSubmission && <SubmissionDetail submission={currSubmission} handleClose={genhandleClose()} />}
      <div>
        <HTMLTable bordered={true} striped={true} interactive={true} className='submissions-table'>
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
            {submissions.length === 0 && (
              <tr>
                <td colSpan={5}>No Submissions Yet</td>
              </tr>
            )}
            {submissions.map(submission => (
              <tr key={submission.id} onClick={genhandleClick(submission)}>
                <td>{submission.id}</td>
                <td>
                  <Tooltip
                    className={Classes.TOOLTIP_INDICATOR}
                    content={moment(submission.issuedTime).format('dddd, MMMM Do YYYY, h:mm:ss a')}
                  >
                    {moment(submission.issuedTime).from(currentMoment)}
                  </Tooltip>
                </td>
                <td>
                  <Link to={`/contest/problems/${submission.problem.id}`}>{submission.problem.name}</Link>
                </td>
                <td>{submission.language.name}</td>
                <td>
                  <Verdict verdict={submission.verdict} />
                </td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      </div>
    </ContentWithHeader>
  )
}
