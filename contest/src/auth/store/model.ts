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

export interface UserModel {
  id: string
  contestId: string
  username: string
  email: string
  name: string

  permissions: Permission[]

  password: string
  token: string
}
