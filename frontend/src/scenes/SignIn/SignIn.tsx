import React, { ComponentType } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

import './styles.css'

import { publicOnly } from '../../helpers/auth'
import { AppThunkDispatch } from '../../stores'
import { setTitle } from '../../stores/Title'
import { SignInView } from './SignInView'

export interface SignInProps {
  dispatch: AppThunkDispatch
}

class SignIn extends React.Component<SignInProps> {
  componentDidMount() {
    this.props.dispatch(setTitle('UGrade | Sign In'))
  }
  render() {
    return <SignInView />
  }
}

export default compose<ComponentType>(
  publicOnly(),
  connect()
)(SignIn)
