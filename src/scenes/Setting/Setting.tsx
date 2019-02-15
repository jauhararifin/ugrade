import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { AppAction, AppState } from '../../stores'
import { setTitle } from '../../stores/Title'
import { SettingView } from './SettingView'

export interface SettingProps {
  dispatch: Dispatch<AppAction>
  signedIn: boolean
}

export class Setting extends React.Component<SettingProps> {
  componentDidMount() {
    this.props.dispatch(setTitle('UGrade | Settings'))
  }
  render() {
    return (
      <SettingView
        showSignIn={!this.props.signedIn}
        showSignUp={!this.props.signedIn}
      />
    )
  }
}

const mapStateToProps = (state: AppState) => ({
  signedIn: state.auth.isSignedIn,
})

export default connect(mapStateToProps)(Setting)
