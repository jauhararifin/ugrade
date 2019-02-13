import { CallHistoryMethodAction, push } from 'connected-react-router'
import React, { Component, ComponentType } from 'react'
import { connect } from 'react-redux'
import { compose, Dispatch } from 'redux'

import { publicOnly } from '../../helpers/auth'
import { AppAction } from '../../stores'
import { setTitle } from '../../stores/Title'
import HomePage from './HomePage'

export interface HomeSceneProps {
  push: (location: string) => CallHistoryMethodAction
  dispatch: Dispatch<AppAction>
}

export class HomeScene extends Component<HomeSceneProps> {
  componentDidMount() {
    this.props.dispatch(setTitle('UGrade | Home'))
  }
  render() {
    const createPush = (to: string) => () => this.props.push(to)
    return (
      <HomePage
        onLogoClick={createPush('/')}
        onSignInClick={createPush('/signin')}
        onSignUpClick={createPush('/signup')}
        onSettingClick={createPush('/setting')}
      />
    )
  }
}

export default compose<ComponentType>(
  publicOnly('/contests'),
  connect(
    null,
    { push }
  )
)(HomeScene)
