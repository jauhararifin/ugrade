/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdatePermission
// ====================================================

export interface UpdatePermission_updateUserPermissions {
  __typename: "UserType";
  id: string;
  permissions: string[];
}

export interface UpdatePermission {
  updateUserPermissions: UpdatePermission_updateUserPermissions | null;
}

export interface UpdatePermissionVariables {
  userId: string;
  permissions: string[];
}
