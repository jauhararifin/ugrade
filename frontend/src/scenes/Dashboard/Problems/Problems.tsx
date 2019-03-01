import { push } from 'connected-react-router'
import React, { ComponentType, FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { compose, Dispatch } from 'redux'
import { contestOnly } from 'ugrade/helpers/auth'
import { AppState, AppThunkDispatch } from 'ugrade/store'
import { getProblemList, Problem } from 'ugrade/stores/Contest'
import { useProblems } from '../helpers'
import ProblemsView from './ProblemsView'

export interface ProblemsProps {
  problems?: Problem[]
  dispatch: AppThunkDispatch & Dispatch
}

export const Problems: FunctionComponent<ProblemsProps> = ({
  problems,
  dispatch,
}) => {
  useProblems(dispatch)
  const handleProblemChoose = (problem: Problem) => {
    dispatch(push(`/contest/problems/${problem.id}`))
  }
  return <ProblemsView problems={problems} onChoose={handleProblemChoose} />
}

const mapStateToProps = (state: AppState) => ({
  problems: getProblemList(state),
})

export default compose<ComponentType>(
  contestOnly(),
  connect(mapStateToProps)
)(Problems)
