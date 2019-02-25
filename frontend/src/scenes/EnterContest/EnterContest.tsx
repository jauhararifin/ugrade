import { Location } from 'history'
import React, { ComponentType } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { compose } from 'redux'

import { publicOnly } from '../../helpers/auth'
import { AppThunkDispatch } from '../../stores'
import { setTitle } from '../../stores/Title'
import { EnterContestView } from './EnterContestView'

export interface EnterContestProps {
  dispatch: AppThunkDispatch
  location: Location
}

class EnterContest extends React.Component<EnterContestProps> {
  componentDidMount() {
    this.props.dispatch(setTitle('UGrade | Enter Contest'))
  }
  render() {
    return <EnterContestView location={this.props.location} />
  }
}

export default compose<ComponentType>(
  publicOnly(),
  connect(),
  withRouter
)(EnterContest)
