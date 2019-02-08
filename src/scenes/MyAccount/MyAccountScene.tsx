import React, { ComponentType } from "react"
import { compose } from "redux"
import { connect } from "react-redux"

import { MyAccountPage } from "./MyAccountPage"
import { userOnly } from "../../helpers/auth"
import { User } from "../../stores/Auth"
import { AppThunkDispatch } from "../../stores"
import { getProfile } from "./actions";

export interface MyAccountSceneProps {
  dispatch: AppThunkDispatch
}

export interface MyAccountSceneState {
  me?: User
}

export class MyAccountScene extends React.Component<MyAccountSceneProps, MyAccountSceneState> {
  constructor(props: MyAccountSceneProps) {
    super(props)
    this.state = { me: undefined }
  }
  async componentDidMount() {
    const me = await this.props.dispatch(getProfile())
    this.setState({me})
  }
  render() {
    return <MyAccountPage loading={!this.state.me} />
  }
}

export default compose<ComponentType>(
  connect(),
  userOnly(),
)(MyAccountScene)
