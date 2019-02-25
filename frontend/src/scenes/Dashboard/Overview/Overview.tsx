import React, { Component, ComponentType } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { contestOnly } from '../../../helpers/auth'
import { AppState } from '../../../stores'
import { ContestInfo } from '../../../stores/Contest'
import ContestOverviewPage from './OverviewView'

export interface OverviewProps {
  contest?: ContestInfo
}

export class Overview extends Component<OverviewProps> {
  render() {
    const { contest } = this.props
    return <ContestOverviewPage contest={contest} />
  }
}

const mapStateToProps = (state: AppState) => ({
  contest: state.contest.info,
})

export default compose<ComponentType>(
  contestOnly(),
  connect(mapStateToProps)
)(Overview)
