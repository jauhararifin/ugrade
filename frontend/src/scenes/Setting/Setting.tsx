import React, { FunctionComponent } from 'react'
import { Dispatch } from 'redux'
import { useIsSignedIn } from 'ugrade/auth'
import { useTitle } from 'ugrade/common/title'
import { AppAction } from 'ugrade/store'
import { SettingView } from './SettingView'

export interface SettingProps {
  dispatch: Dispatch<AppAction>
  signedIn: boolean
}

export const Setting: FunctionComponent<SettingProps> = () => {
  useTitle('UGrade | Settings')
  const signedIn = useIsSignedIn()
  return (
    <SettingView showCreateContest={!signedIn} showEnterContest={!signedIn} />
  )
}
