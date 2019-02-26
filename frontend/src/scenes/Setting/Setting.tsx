import React, { FunctionComponent, useEffect } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { AppAction, AppState } from '../../stores'
import { setTitle } from '../../stores/Title'
import { SettingView } from './SettingView'

export interface SettingProps {
  dispatch: Dispatch<AppAction>
  signedIn: boolean
}

export const Setting: FunctionComponent<SettingProps> = ({
  signedIn,
  dispatch,
}) => {
  useEffect(() => {
    dispatch(setTitle('UGrade | Settings'))
  })
  return (
    <SettingView showCreateContest={!signedIn} showEnterContest={!signedIn} />
  )
}

const mapStateToProps = (state: AppState) => ({
  signedIn: state.auth.isSignedIn,
})

export default connect(mapStateToProps)(Setting)
