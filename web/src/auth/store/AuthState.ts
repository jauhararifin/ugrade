export const AUTH_IS_SIGNED_IN_KEY = 'auth.isSignedIn'
export const AUTH_TOKEN_KEY = 'auth.token'

export enum UserPermission {
  InfoUpdate = 'InfoUpdate',
  AnnouncementCreate = 'AnnouncementCreate',
  AnnouncementRead = 'AnnouncementRead',
  ClarificationsRead = 'ClarificationsRead', // can read all clarification
  ClarificationsCreate = 'ClarificationsCreate', // can create and read own clarification
  ClarificationReply = 'ClarificationReply', // can reply all clarification
  ProblemsCreate = 'ProblemsCreate',
  ProblemsRead = 'ProblemsRead',
  ProblemsReadDisabled = 'ProblemsReadDisabled',
  ProblemsUpdate = 'ProblemsUpdate',
  ProblemsDelete = 'ProblemsDelete',
  UsersInvite = 'UsersInvite',
  UsersPermissionsUpdate = 'UsersPermissionsUpdate',
  UsersDelete = 'UsersDelete',
  ProfilesRead = 'ProfilesRead',
  SubmissionsRead = 'SubmissionsRead', // can read all submission
  SubmissionsCreate = 'SubmissionsCreate', // can submit
}

export const allPermissions = [
  UserPermission.InfoUpdate,
  UserPermission.AnnouncementCreate,
  UserPermission.AnnouncementRead,
  UserPermission.ClarificationsRead,
  UserPermission.ClarificationsCreate,
  UserPermission.ClarificationReply,
  UserPermission.ProblemsCreate,
  UserPermission.ProblemsRead,
  UserPermission.ProblemsReadDisabled,
  UserPermission.ProblemsUpdate,
  UserPermission.ProblemsDelete,
  UserPermission.UsersInvite,
  UserPermission.UsersPermissionsUpdate,
  UserPermission.UsersDelete,
  UserPermission.ProfilesRead,
  UserPermission.SubmissionsRead,
  UserPermission.SubmissionsCreate,
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
