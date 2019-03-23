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
  SubmissionsCreate = 'SUbmissionsCreate', // can submit
}

export const adminPermissions = [
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

export const contestantPermissions = [UserPermission.AnnouncementRead, UserPermission.ProblemsRead]
