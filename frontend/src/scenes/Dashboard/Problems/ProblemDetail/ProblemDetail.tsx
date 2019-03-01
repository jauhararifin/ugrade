import React, { ComponentType, FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { compose } from 'redux'
import { contestOnly } from 'ugrade/helpers/auth'
import { AppState } from 'ugrade/store'
import { Problem } from 'ugrade/stores/Contest'
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
  const problem = problemMap && problemMap[match.params.problemId]
  return <ProblemDetailView problem={problem} />
}

const mapStateToProps = (state: AppState) => ({
  problemMap: state.contest.problems,
})

export default compose<ComponentType>(
  contestOnly(),
  connect(mapStateToProps)
)(ProblemDetail)
