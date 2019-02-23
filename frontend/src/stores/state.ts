import { RouterState } from 'connected-react-router'

import { AuthState } from './Auth'
import { ContestState } from './Contest'
import { ServerStatusState } from './ServerStatus'
import { SettingState } from './Setting'
import { TitleState } from './Title'
import { UserProfileState } from './UserProfile'

export interface AppState {
  router: RouterState
  title: TitleState
  auth: AuthState
  setting: SettingState
  server: ServerStatusState
  contest: ContestState
  userProfile: UserProfileState
}
