import React, { SFC, ComponentType } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { push, CallHistoryMethodAction } from 'connected-react-router'

import { publicOnly } from '../../helpers/auth'
import HomePage from './HomePage'

export interface HomeScene {
    push: (location: string) => CallHistoryMethodAction
}

export const HomeScene: SFC<HomeScene> = ({ push }) => <HomePage
    onLogoClick={() => push("/")}
    onSignInClick={() => push("/signin")}
    onSignUpClick={() => push("/signup")}
    onSettingClick={() => push("/setting")}
/>

export default compose<ComponentType>(
    publicOnly("/contests"),
    connect(null, { push }),
)(HomeScene)