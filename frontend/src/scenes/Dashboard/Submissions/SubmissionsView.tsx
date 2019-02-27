import {
  Card,
  Classes,
  H1,
  HTMLTable,
  Intent,
  Tag,
  Tooltip,
} from '@blueprintjs/core'
import classnames from 'classnames'
import 'github-markdown-css'
import moment from 'moment'
import React, { FunctionComponent, useState } from 'react'

import './styles.css'

import { Link } from 'react-router-dom'
import {
  GradingVerdict,
  Language,
  Problem,
  Submission,
  SubmissionVerdict,
} from '../../../stores/Contest'
import SubmissionDetail from './SubmissionDetail'

export interface ISubmission extends Submission {
  problem: Problem
  language: Language
}

export interface SubmissionsViewProps {
  submissions?: ISubmission[]
  serverClock?: Date
}

export interface SubmissionViewState {
  currentSubmission?: ISubmission
}

export const SubmissionsView: FunctionComponent<SubmissionsViewProps> = ({
  submissions,
  serverClock,
}) => {
  const [currSubmission, setCurrSubmission] = useState(undefined as
    | ISubmission
    | undefined)
  const genhandleClose = () => () => setCurrSubmission(undefined)
  const genhandleClick = (submission: ISubmission) => () =>
    setCurrSubmission(submission)

  const renderVerdict = (verdict: SubmissionVerdict) => {
    switch (verdict) {
      case GradingVerdict.Accepted:
        return <Tag intent={Intent.SUCCESS}>Accepted</Tag>
      case GradingVerdict.WrongAnswer:
        return <Tag intent={Intent.DANGER}>Wrong Answer</Tag>
      case GradingVerdict.TimeLimitExceeded:
        return <Tag intent={Intent.WARNING}>Time Limit Exceeded</Tag>
      case GradingVerdict.MemoryLimitExceeded:
        return <Tag intent={Intent.WARNING}>Memory Limit Exceeded</Tag>
      case GradingVerdict.RuntimeError:
        return <Tag intent={Intent.WARNING}>Runtime Error</Tag>
      case GradingVerdict.CompilationError:
        return <Tag intent={Intent.WARNING}>Compilation Error</Tag>
      case GradingVerdict.InternalError:
        return <Tag intent={Intent.WARNING}>Internal Error</Tag>
      default:
        return <Tag>Pending</Tag>
    }
  }

  const loading = !submissions || !serverClock
  const currentMoment = moment(serverClock || new Date())

  return (
    <React.Fragment>
      {serverClock && currSubmission && (
        <SubmissionDetail
          submission={currSubmission}
          handleClose={genhandleClose()}
          serverClock={serverClock}
        />
      )}
      <div className='contest-submissions'>
        <H1 className={classnames('header', { 'bp3-skeleton': loading })}>
          Submissions
        </H1>
        <div>
          {loading ? (
            <Card className='bp3-skeleton item'>
              {'lorem ipsum'.repeat(100)}
            </Card>
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
                    <tr
                      key={submission.id}
                      onClick={genhandleClick(submission)}
                    >
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
                      <td>
                        <Link to={`/contest/problems/${submission.problemId}`}>
                          {submission.problem.name}
                        </Link>
                      </td>
                      <td>{submission.language.name}</td>
                      <td>{renderVerdict(submission.verdict)}</td>
                    </tr>
                  ))}
              </tbody>
            </HTMLTable>
          )}
        </div>
      </div>
    </React.Fragment>
  )
}

export default SubmissionsView
