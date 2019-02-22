import React, { ComponentType } from 'react'
import { connect } from 'react-redux'

import './styles.css'

import { compose } from 'redux'
import { publicOnly } from '../../helpers/auth'
import { AppThunkDispatch } from '../../stores'
import { setTitle } from '../../stores/Title'
import { SignUpView } from './SignUpView'

export interface SignUpProps {
  dispatch: AppThunkDispatch
}

class SignUp extends React.Component<SignUpProps> {
  componentDidMount() {
    this.props.dispatch(setTitle('UGrade | Sign Up'))
  }
  render() {
    return <SignUpView />
  }
}

export default compose<ComponentType>(
  publicOnly(),
  connect()
)(SignUp)
