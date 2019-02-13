import { AuthSetMe } from './AuthSetMe'
import { AuthSetSignedIn } from './AuthSetSignedIn'
import { AuthSetSignedOut } from './AuthSetSignedOut'

export enum AuthActionType {
  SetSignedIn = 'AUTH_ACTION_SET_SIGNED_IN',
  SetSignedOut = 'AUTH_ACTION_SET_SIGNED_OUT',
  SetMe = 'AUTH_ACTION_SET_ME',
}

export type AuthAction = AuthSetSignedIn | AuthSetMe | AuthSetSignedOut
