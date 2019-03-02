import { AuthSetMe } from './AuthSetMe'
import { AuthSetSignedIn } from './AuthSetSignedIn'
import { AuthSetSignedOut } from './AuthSetSignedOut'
import { AuthSetUser } from './AuthSetUser'

export enum AuthActionType {
  SetSignedIn = 'AUTH_ACTION_SET_SIGNED_IN',
  SetSignedOut = 'AUTH_ACTION_SET_SIGNED_OUT',
  SetMe = 'AUTH_ACTION_SET_ME',
  SetUser = 'AUTH_ACTION_SET_USER',
}

export type AuthAction =
  | AuthSetSignedIn
  | AuthSetMe
  | AuthSetSignedOut
  | AuthSetUser
