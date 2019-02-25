import React, { ComponentType } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { publicOnly } from '../../helpers/auth'
import { AppThunkDispatch } from '../../stores'
import { setTitle } from '../../stores/Title'
import { CreateContestView } from './CreateContestView'

export interface CreateContestProps {
  dispatch: AppThunkDispatch
}

class CreateContest extends React.Component<CreateContestProps> {
  componentDidMount() {
    this.props.dispatch(setTitle('UGrade | Create Contest'))
  }
  render() {
    return <CreateContestView />
  }
}

export default compose<ComponentType>(
  publicOnly(),
  connect()
)(CreateContest)
