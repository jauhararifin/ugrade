import React, { ComponentType, FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { useContestOnly } from 'ugrade/auth'
import { ContestInfo } from 'ugrade/contest/store'
import { AppState, AppThunkDispatch } from 'ugrade/store'
import { useInfo } from '../helpers'
import OverviewView from './OverviewView'

export interface OverviewProps {
  contest?: ContestInfo
  dispatch: AppThunkDispatch
}

export const Overview: FunctionComponent<OverviewProps> = ({
  contest,
  dispatch,
}) => {
  useContestOnly()
  useInfo(dispatch)
  return <OverviewView contest={contest} />
}

const mapStateToProps = (state: AppState) => ({
  contest: state.contest.info,
})

export default compose<ComponentType>(connect(mapStateToProps))(Overview)
