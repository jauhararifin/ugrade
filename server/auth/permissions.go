package auth

const (
	// PermissionInfoUpdate indicates user's permission to update contest info.
	PermissionInfoUpdate = iota

	// PermissionAnnouncementsCreate indicates user's permission to create contest announcements.
	PermissionAnnouncementsCreate = iota

	// PermissionAnnouncementsRead indicates user's permission to read contest announcements.
	PermissionAnnouncementsRead = iota

	// PermissionProblemsCreate indicates user's permission to create contest problems.
	PermissionProblemsCreate = iota

	// PermissionProblemsRead indicates user's permission to read contest problems.
	PermissionProblemsRead = iota

	// PermissionProblemsReadDisabled indicates user's permission to read disabled contest problems.
	PermissionProblemsReadDisabled = iota

	// PermissionProblemsUpdate indicates user's permission to update contest problem.
	PermissionProblemsUpdate = iota

	// PermissionUsersInvite indicates user's permission to invite other user into a contest.
	PermissionUsersInvite = iota

	// PermissionUsersPermissionsUpdate indicates user's permission to update other user's permissions.
	PermissionUsersPermissionsUpdate = iota

	// PermissionUsersDelete indicates user's permission to delete other user from contest.
	PermissionUsersDelete = iota
)

// Permissions is the list contain all possible user's permissions
var Permissions = []int{
	PermissionInfoUpdate,
	PermissionAnnouncementsCreate,
	PermissionAnnouncementsRead,
	PermissionProblemsCreate,
	PermissionProblemsRead,
	PermissionProblemsReadDisabled,
	PermissionProblemsUpdate,
	PermissionUsersInvite,
	PermissionUsersPermissionsUpdate,
	PermissionUsersDelete,
}
