import { RouterAction } from 'connected-react-router'
import { AuthAction } from './Auth'
import { ContestAction } from './Contest'
import { ServerStatusAction } from './ServerStatus'
import { SettingAction } from './Setting'
import { TitleAction } from './Title'
import { UserProfileAction } from './UserProfile'

export type AppAction =
  | TitleAction
  | RouterAction
  | AuthAction
  | SettingAction
  | ServerStatusAction
  | ContestAction
  | UserProfileAction
