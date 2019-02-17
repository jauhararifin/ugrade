import React, { Component, ComponentType } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { userOnly } from '../../../helpers/auth'
import { withServer } from '../../../helpers/server'
import { AppState, AppThunkDispatch } from '../../../stores'
import { User } from '../../../stores/Auth'
import {
  Contest,
  Language,
  Problem,
  ProblemType,
  Submission,
} from '../../../stores/Contest'
import { setCurrentContestSubmissions } from '../../../stores/Contest/ContestSetCurrentContestSubmissions'
import { getContestSubmissions, subscribeContestSubmissions } from './actions'
import SubmissionsView, { ISubmission } from './SubmissionsView'

export interface SubmissionServerProps {
  serverClock: Date
}

export interface SubmissionsReduxProps {
  contest?: Contest
  me: User
  dispatch: AppThunkDispatch
}

export type SubmissionProps = SubmissionServerProps & SubmissionsReduxProps

export class Submissions extends Component<SubmissionProps> {
  private unsubscribeContestSubmissions: () => any
  private initialized: boolean

  constructor(props: SubmissionProps) {
    super(props)

    this.initialized = false
    this.unsubscribeContestSubmissions = () => null
  }

  componentDidMount() {
    this.initializeSubmissions().catch(_ => null)
  }
  componentWillUpdate() {
    this.initializeSubmissions().catch(_ => null)
  }
  componentWillUnmount() {
    this.unsubscribeContestSubmissions()
  }

  initializeSubmissions = async () => {
    const contest = this.props.contest
    if (!this.initialized && contest) {
      this.initialized = true
      await this.props.dispatch(getContestSubmissions(contest.id))
      this.unsubscribeContestSubmissions = await this.props.dispatch(
        subscribeContestSubmissions(contest, this.submissionsIssued)
      )
    }
  }

  submissionsIssued = (submissions: Submission[]) => {
    this.props.dispatch(
      setCurrentContestSubmissions(this.props.contest as Contest, submissions)
    )
  }

  render() {
    const { contest, serverClock, me } = this.props

    if (contest) {
      const problems = contest.problems
      const languages = contest.permittedLanguages

      if (problems && languages) {
        const problemId: { [id: number]: Problem } = {}
        const languageId: { [id: number]: Language } = {}
        const submissions = contest ? contest.submissions || [] : []
        const myUsername = me ? me.username : ''
        const mySubmissions = submissions.filter(
          submission => submission.issuer === myUsername
        )

        const noneProblem: Problem = {
          id: 0,
          slug: 'unknown',
          name: 'Unknown',
          statement: '',
          type: ProblemType.PROBLEM_TYPE_BATCH,
          timeLimit: 0,
          tolerance: 0,
          memoryLimit: 0,
          outputLimit: 0,
        }

        const noneLanguage = {
          id: 0,
          name: 'Unknown',
        }

        const isubmissions = mySubmissions.map(
          (submission: Submission): ISubmission => ({
            ...submission,
            problem: problemId[submission.problemId] || noneProblem,
            language: languageId[submission.languageId] || noneLanguage,
          })
        )

        return (
          <SubmissionsView
            submissions={isubmissions}
            serverClock={serverClock}
          />
        )
      }
    }

    return <SubmissionsView serverClock={serverClock} />
  }
}

const mapStateToProps = (state: AppState) => ({
  contest: state.contest.currentContest,
  me: state.auth.me,
})

export default compose<ComponentType>(
  userOnly(),
  connect(mapStateToProps),
  withServer
)(Submissions)
