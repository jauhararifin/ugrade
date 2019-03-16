export enum Permission {
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
