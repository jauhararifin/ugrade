import { push } from 'connected-react-router'
import React, { ComponentType, FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { compose, Dispatch } from 'redux'
import { useContestOnly } from 'ugrade/auth'
import { getProblemList, Problem } from 'ugrade/contest/store'
import { AppState, AppThunkDispatch } from 'ugrade/store'
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
  useContestOnly()
  useProblems(dispatch)
  const handleProblemChoose = (problem: Problem) => {
    dispatch(push(`/contest/problems/${problem.id}`))
  }
  return <ProblemsView problems={problems} onChoose={handleProblemChoose} />
}

const mapStateToProps = (state: AppState) => ({
  problems: getProblemList(state),
})

export default compose<ComponentType>(connect(mapStateToProps))(Problems)
