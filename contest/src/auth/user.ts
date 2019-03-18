export enum Permission {
  InfoUpdate = 'InfoUpdate',
  AnnouncementCreate = 'AnnouncementCreate',
  AnnouncementRead = 'AnnouncementRead',
  ProblemsCreate = 'ProblemsCreate',
  ProblemsRead = 'ProblemsRead',
  ProblemsReadDisabled = 'ProblemsReadDisabled',
  ProblemsUpdate = 'ProblemsUpdate',
  ProblemsDelete = 'ProblemsDelete',
  UsersInvite = 'UsersInvite',
  UsersPermissionsUpdate = 'UsersPermissionsUpdate',
  UsersDelete = 'UsersDelete',
  ProfilesRead = 'ProfilesRead',
}

export const allPermissions = [
  Permission.InfoUpdate,
  Permission.AnnouncementCreate,
  Permission.AnnouncementRead,
  Permission.ProblemsCreate,
  Permission.ProblemsRead,
  Permission.ProblemsReadDisabled,
  Permission.ProblemsUpdate,
  Permission.ProblemsDelete,
  Permission.UsersInvite,
  Permission.UsersPermissionsUpdate,
  Permission.UsersDelete,
  Permission.ProfilesRead,
]

export interface User {
  id: string
  contestId: string
  username: string
  email: string
  name: string
  permissions: Permission[]
  password: string
  token: string
  signUpCode?: string
  resetPasswordCode?: string
}
