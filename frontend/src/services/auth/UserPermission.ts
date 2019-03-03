export enum UserPermission {
  InfoUpdate = 'info:update',
  AnnouncementCreate = 'announcement:create',
}

export const adminPermissions = [
  UserPermission.InfoUpdate,
  UserPermission.AnnouncementCreate,
]
