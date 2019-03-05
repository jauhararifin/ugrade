export const AUTH_IS_SIGNED_IN_KEY = 'auth.isSignedIn'
export const AUTH_TOKEN_KEY = 'auth.token'

export enum UserPermission {
  InfoUpdate = 'info:update',
  AnnouncementCreate = 'announcement:create',
  AnnouncementRead = 'announcement:read',

  ProblemsCreate = 'problems:create',
  ProblemsRead = 'problems:create',
  ProblemsUpdate = 'problems:create',
  ProblemsDelete = 'problems:create',
}

export interface User {
  id: string
  contestId: string
  username: string
  name: string
  email: string
  permissions: UserPermission[]
}

export interface AuthState {
  isSignedIn: boolean
  token: string
  me?: User
  users: { [userId: string]: User }
}

export const initialState: AuthState = {
  isSignedIn:
    (sessionStorage.getItem(AUTH_IS_SIGNED_IN_KEY) ||
      localStorage.getItem(AUTH_IS_SIGNED_IN_KEY)) === 'true',
  token:
    sessionStorage.getItem(AUTH_TOKEN_KEY) ||
    localStorage.getItem(AUTH_TOKEN_KEY) ||
    '',
  users: {},
}
