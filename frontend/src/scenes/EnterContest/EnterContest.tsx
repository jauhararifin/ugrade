import { Location } from 'history'
import React, { ComponentType, FunctionComponent, useEffect } from 'react'
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

const EnterContest: FunctionComponent<EnterContestProps> = ({
  dispatch,
  location,
}) => {
  useEffect(() => {
    dispatch(setTitle('UGrade | Enter Contest'))
  })
  return <EnterContestView location={location} />
}

export default compose<ComponentType>(
  publicOnly(),
  connect(),
  withRouter
)(EnterContest)
