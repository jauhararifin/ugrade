import { CallHistoryMethodAction, push } from 'connected-react-router'
import React, { Component, ComponentType } from 'react'
import { connect } from 'react-redux'
import { compose, Dispatch } from 'redux'

import { publicOnly } from '../../helpers/auth'
import { AppAction } from '../../stores'
import { setTitle } from '../../stores/Title'
import HomeView from './HomeView'

export interface HomeProps {
  push: (location: string) => CallHistoryMethodAction
  dispatch: Dispatch<AppAction>
}

export class Home extends Component<HomeProps> {
  componentDidMount() {
    this.props.dispatch(setTitle('UGrade | Home'))
  }
  render() {
    const createPush = (to: string) => () => this.props.dispatch(push(to))
    return (
      <HomeView
        onLogoClick={createPush('/')}
        onEnterContest={createPush('/enter-contest')}
        onCreateContest={createPush('/create-contest')}
        onSettingClick={createPush('/setting')}
      />
    )
  }
}

export default compose<ComponentType>(
  publicOnly('/contest'),
  connect()
)(Home)
