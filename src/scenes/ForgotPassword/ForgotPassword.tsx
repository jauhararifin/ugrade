import React, { Component, ComponentType } from 'react'
import { compose } from 'redux'

import { publicOnly } from '../../helpers/auth'
import ForgotPasswordView from './ForgotPasswordView'

export class ForgotPasswordScene extends Component {
  render() {
    return <ForgotPasswordView />
  }
}

export default compose<ComponentType>(publicOnly())(ForgotPasswordScene)
