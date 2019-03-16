import { Permission } from './permission'

export interface User {
  id: string
  contestId: string
  username: string
  email: string
  name: string
  permissions: Permission[]
}
