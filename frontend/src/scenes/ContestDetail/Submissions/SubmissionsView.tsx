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
import React, { Component } from 'react'

import './styles.css'

import {
  GradingVerdict,
  Language,
  Problem,
  Submission,
  SubmissionVerdict,
} from '../../../stores/Contest'
import SubmissionDetail from './Detail'

export interface ISubmission extends Submission {
  problem: Problem
  language: Language
}

export interface SubmissionsViewProps {
  submissions?: ISubmission[]
  serverClock?: Date
  handleProblemClick?: (problemId: number) => any
}

export interface SubmissionViewState {
  currentSubmission?: ISubmission
}

export class SubmissionsView extends Component<
  SubmissionsViewProps,
  SubmissionViewState
> {
  constructor(props: SubmissionsViewProps) {
    super(props)
    this.state = { currentSubmission: undefined }
  }

  renderVerdict = (verdict: SubmissionVerdict) => {
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

  genProblemOnClick = (problemId: number) => () => {
    const handleProblemClick = this.props.handleProblemClick
    if (handleProblemClick) handleProblemClick(problemId)
  }

  genSubmissionOnClick = (submission: ISubmission) => () =>
    this.setState({ currentSubmission: submission })

  submissionUnchooseHandler = () =>
    this.setState({ currentSubmission: undefined })

  render() {
    const { submissions, serverClock } = this.props
    const loading = !submissions || !serverClock
    const currentMoment = moment(serverClock || new Date())

    return (
      <React.Fragment>
        {serverClock && (
          <SubmissionDetail
            submission={this.state.currentSubmission}
            handleClose={this.submissionUnchooseHandler}
            serverClock={serverClock || new Date()}
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
                        onClick={this.genSubmissionOnClick(submission)}
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
                          <a
                            onClick={this.genProblemOnClick(
                              submission.problem.id
                            )}
                          >
                            {submission.problem.name}
                          </a>
                        </td>
                        <td>{submission.language.name}</td>
                        <td>{this.renderVerdict(submission.verdict)}</td>
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
}

export default SubmissionsView
