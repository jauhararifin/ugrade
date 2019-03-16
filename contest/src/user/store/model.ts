import { Permission } from '../permission'

export type PermissionModel = Permission

export interface UserModel {
  id: string
  contestId: string
  username: string
  email: string
  name: string
  permissions: Permission[]
}
