export const AUTH_IS_SIGNED_IN_KEY = 'auth.isSignedIn'
export const AUTH_TOKEN_KEY = 'auth.token'

export enum UserPermission {
  InfoUpdate = 'info:update',
  AnnouncementCreate = 'announcement:create',
  AnnouncementRead = 'announcement:read',

  ProblemsCreate = 'problems:create',
  ProblemsRead = 'problems:read',
  ProblemsReadDisabled = 'problems:read-disabled',
  ProblemsUpdate = 'problems:update',
  ProblemsDelete = 'problems:delete',

  UsersInvite = 'users:invite',
  UsersPermissionsUpdate = 'users:permissions:update',
  UsersDelete = 'users:delete',

  ProfilesRead = 'profiles:read',
}

export const allPermissions = [
  UserPermission.InfoUpdate,
  UserPermission.AnnouncementCreate,
  UserPermission.AnnouncementRead,
  UserPermission.ProblemsCreate,
  UserPermission.ProblemsRead,
  UserPermission.ProblemsReadDisabled,
  UserPermission.ProblemsUpdate,
  UserPermission.ProblemsDelete,
  UserPermission.UsersInvite,
  UserPermission.UsersPermissionsUpdate,
  UserPermission.UsersDelete,
  UserPermission.ProfilesRead,
]

export const adminPermissions = allPermissions

export const contestantPermissions = [UserPermission.AnnouncementRead, UserPermission.ProblemsRead]

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
  isSignedIn: (sessionStorage.getItem(AUTH_IS_SIGNED_IN_KEY) || localStorage.getItem(AUTH_IS_SIGNED_IN_KEY)) === 'true',
  token: sessionStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(AUTH_TOKEN_KEY) || '',
  users: {},
}
