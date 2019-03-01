import React, { ComponentType, FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { compose } from 'redux'
import { useContestOnly } from 'ugrade/auth'
import { Problem } from 'ugrade/contest/store'
import { AppState } from 'ugrade/store'
import { ProblemDetailView } from './ProblemDetailView'

export interface ProblemDetailRoute {
  problemId: string
}

export interface ProblemDetailProps
  extends RouteComponentProps<ProblemDetailRoute> {
  problemMap?: { [id: string]: Problem }
}

export const ProblemDetail: FunctionComponent<ProblemDetailProps> = ({
  problemMap,
  match,
}) => {
  useContestOnly()
  const problem = problemMap && problemMap[match.params.problemId]
  return <ProblemDetailView problem={problem} />
}

const mapStateToProps = (state: AppState) => ({
  problemMap: state.contest.problems,
})

export default compose<ComponentType>(connect(mapStateToProps))(ProblemDetail)
