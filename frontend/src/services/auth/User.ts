import { UserPermission } from './UserPermission'

export interface User {
  id: string
  contestId: string
  username: string
  email: string
  name: string
  permissions: UserPermission[]
}
