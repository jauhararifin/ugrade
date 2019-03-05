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
  ProblemsRead = 'problems:create',
  ProblemsUpdate = 'problems:create',
  ProblemsDelete = 'problems:create',
}

export const adminPermissions = [
  UserPermission.InfoUpdate,
  UserPermission.AnnouncementCreate,
  UserPermission.AnnouncementRead,

  UserPermission.ProblemsCreate,
  UserPermission.ProblemsRead,
  UserPermission.ProblemsUpdate,
  UserPermission.ProblemsDelete,
]

export const contestantPermissions = [UserPermission.AnnouncementRead]
