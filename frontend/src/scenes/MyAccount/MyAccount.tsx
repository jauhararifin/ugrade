import React, { ComponentType } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { contestOnly } from '../../helpers/auth'
import { AppThunkDispatch } from '../../stores'
import { User } from '../../stores/Auth'
import { getMyProfile } from './actions'
import { MyAccountView } from './MyAccountView'

export interface MyAccountProps {
  dispatch: AppThunkDispatch
}

export interface MyAccountState {
  me?: User
}

export class MyAccount extends React.Component<MyAccountProps, MyAccountState> {
  constructor(props: MyAccountProps) {
    super(props)
    this.state = { me: undefined }
  }
  async componentDidMount() {
    const me = await this.props.dispatch(getMyProfile())
    this.setState({ me })
  }
  render() {
    return <MyAccountView loading={!this.state.me} />
  }
}

export default compose<ComponentType>(
  connect(),
  contestOnly()
)(MyAccount)
