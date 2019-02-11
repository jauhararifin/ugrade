import { CallHistoryMethodAction, push } from 'connected-react-router'
import React, { ComponentType, FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { publicOnly } from '../../helpers/auth'
import HomePage from './HomePage'

export interface HomeScene {
  push: (location: string) => CallHistoryMethodAction
}

export const HomeScene: FunctionComponent<HomeScene> = props => {
  const createPush = (to: string) => () => props.push(to)
  return (
    <HomePage
      onLogoClick={createPush('/')}
      onSignInClick={createPush('/signin')}
      onSignUpClick={createPush('/signup')}
      onSettingClick={createPush('/setting')}
    />
  )
}

export default compose<ComponentType>(
  publicOnly('/contests'),
  connect(
    null,
    { push }
  )
)(HomeScene)
