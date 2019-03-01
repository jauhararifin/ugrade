import React, { ComponentType, FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { useContestOnly } from 'ugrade/auth'
import {
  getLanguagesMap,
  getSubmissionList,
  Language,
  Problem,
  ProblemType,
  Submission,
} from 'ugrade/contest/store'
import { withServer, WithServerProps } from 'ugrade/helpers/server'
import { AppState, AppThunkDispatch } from 'ugrade/store'
import { useInfo, useProblems } from '../helpers'
import SubmissionsView, { ISubmission } from './SubmissionsView'
import { useSubmissions } from './useSubmissions'

export interface SubmissionsReduxProps {
  submissions?: Submission[]
  problems?: { [id: string]: Problem }
  languages?: { [id: string]: Language }
  dispatch: AppThunkDispatch
}

export type SubmissionProps = SubmissionsReduxProps & WithServerProps

export const Submissions: FunctionComponent<SubmissionProps> = ({
  submissions,
  problems,
  languages,
  dispatch,
  serverClock,
}) => {
  useContestOnly()
  useSubmissions(dispatch)
  useInfo(dispatch)
  useProblems(dispatch)

  if (problems && languages) {
    const mySubmissions = submissions || []

    const noneProblem: Problem = {
      id: '',
      shortId: 'unknown',
      name: 'Unknown',
      statement: '',
      type: ProblemType.PROBLEM_TYPE_BATCH,
      timeLimit: 0,
      tolerance: 0,
      memoryLimit: 0,
      outputLimit: 0,
      order: 0,
    }

    const noneLanguage: Language = {
      id: '',
      name: 'Unknown',
    }

    const isubmissions = mySubmissions.map(
      (submission: Submission): ISubmission => ({
        ...submission,
        problem: problems[submission.problemId] || noneProblem,
        language: languages[submission.languageId] || noneLanguage,
      })
    )

    return (
      <SubmissionsView submissions={isubmissions} serverClock={serverClock} />
    )
  }
  return <SubmissionsView />
}

const mapStateToProps = (state: AppState) => ({
  submissions: getSubmissionList(state),
  problems: state.contest.problems,
  languages: getLanguagesMap(state),
})

export default compose<ComponentType>(
  connect(mapStateToProps),
  withServer
)(Submissions)
