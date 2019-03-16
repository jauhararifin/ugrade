import { Permission } from './permission'
import { Contest } from '../contest'

export interface User {
  id: string
  contest?: Contest
  username: string
  email: string
  name: string
  permissions: Permission[]
}
