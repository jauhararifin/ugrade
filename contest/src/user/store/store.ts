import { UserModel } from './model'

export interface UserStore {
  getUserById(id: string): Promise<UserModel>
  getUserByEmail(contestId: string, email: string): Promise<UserModel>
  getUserByUsername(contestId: string, username: string): Promise<UserModel>
}
