import React, { ComponentType, FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { contestOnly } from 'ugrade/helpers/auth'
import { AppState, AppThunkDispatch } from 'ugrade/store'
import { ContestInfo } from 'ugrade/stores/Contest'
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
  useInfo(dispatch)
  return <OverviewView contest={contest} />
}

const mapStateToProps = (state: AppState) => ({
  contest: state.contest.info,
})

export default compose<ComponentType>(
  contestOnly(),
  connect(mapStateToProps)
)(Overview)
