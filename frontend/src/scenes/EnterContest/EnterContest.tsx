import React, { ComponentType } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { publicOnly } from '../../helpers/auth'
import { AppThunkDispatch } from '../../stores'
import { setTitle } from '../../stores/Title'
import { EnterContestView } from './EnterContestView'

export interface SignInProps {
  dispatch: AppThunkDispatch
}

class SignIn extends React.Component<SignInProps> {
  componentDidMount() {
    this.props.dispatch(setTitle('UGrade | Enter Contest'))
  }
  render() {
    return <EnterContestView />
  }
}

export default compose<ComponentType>(
  publicOnly(),
  connect()
)(SignIn)
