package auth

const (
	// UserPermissionInfoUpdate indicates user's permission to update contest info.
	UserPermissionInfoUpdate = iota

	// UserPermissionAnnouncementsCreate indicates user's permission to create contest announcements.
	UserPermissionAnnouncementsCreate = iota

	// UserPermissionAnnouncementsRead indicates user's permission to read contest announcements.
	UserPermissionAnnouncementsRead = iota

	// UserPermissionProblemsCreate indicates user's permission to create contest problems.
	UserPermissionProblemsCreate = iota

	// UserPermissionProblemsRead indicates user's permission to read contest problems.
	UserPermissionProblemsRead = iota

	// UserPermissionProblemsReadDisabled indicates user's permission to read disabled contest problems.
	UserPermissionProblemsReadDisabled = iota

	// UserPermissionProblemsUpdate indicates user's permission to update contest problem.
	UserPermissionProblemsUpdate = iota

	// UserPermissionUsersInvite indicates user's permission to invite other user into a contest.
	UserPermissionUsersInvite = iota

	// UserPermissionUsersPermissionsUpdate indicates user's permission to update other user's permissions.
	UserPermissionUsersPermissionsUpdate = iota

	// UserPermissionUsersDelete indicates user's permission to delete other user from contest.
	UserPermissionUsersDelete = iota
)
