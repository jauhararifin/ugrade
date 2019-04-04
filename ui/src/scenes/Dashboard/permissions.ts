export const GradeSubmissionsPermission = 'grade:submissions'
export const CreateSubmissionsPermission = 'create:submissions'
export const ReadSubmissionsPermission = 'read:submissions'
export const ReadProfilesPermission = 'read:profiles'
export const DeleteUsersPermission = 'delete:users'
export const UpdateUsersPermissionsPermission = 'update:usersPermissions'
export const InviteUsersPermission = 'invite:users'
export const DeleteProblemsPermission = 'delete:problems'
export const UpdateProblemsPermission = 'update:problems'
export const ReadDisabledProblemsPermission = 'read:disabledProblems'
export const ReadProblemsPermission = 'read:problems'
export const CreateProblemsPermission = 'create:problems'
export const ReplyClarificationPermission = 'reply:clarification'
export const CreateClarificationsPermission = 'create:clarifications'
export const ReadClarificationsPermission = 'read:clarifications'
export const ReadAnnouncementPermission = 'read:announcement'
export const CreateAnnouncementPermission = 'create:announcement'
export const UpdateContestPermission = 'update:contest'

export const allPermissions = [
  CreateSubmissionsPermission,
  ReadSubmissionsPermission,
  ReadProfilesPermission,
  DeleteUsersPermission,
  UpdateUsersPermissionsPermission,
  InviteUsersPermission,
  DeleteProblemsPermission,
  UpdateProblemsPermission,
  ReadDisabledProblemsPermission,
  ReadProblemsPermission,
  CreateProblemsPermission,
  ReplyClarificationPermission,
  CreateClarificationsPermission,
  ReadClarificationsPermission,
  ReadAnnouncementPermission,
  CreateAnnouncementPermission,
  UpdateContestPermission,
  GradeSubmissionsPermission,
]

export const adminPermissions = allPermissions

export const contestantPermissions = [
  ReadAnnouncementPermission,
  ReadProblemsPermission,
  CreateClarificationsPermission,
  GradeSubmissionsPermission,
]
