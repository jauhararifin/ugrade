export enum UserPermission {
  /**
   * can update common contest information like name, description, start time,
   * finish time, etc.
   */
  InfoUpdate = 'info:update',

  /**
   * Can create announcement to the contest
   */
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

export const adminPermissions = [
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

export const contestantPermissions = [UserPermission.AnnouncementRead, UserPermission.ProblemsRead]
