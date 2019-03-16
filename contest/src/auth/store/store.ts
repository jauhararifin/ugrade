import { UserModel } from './model'

export interface AuthStore {
  getUserById(id: string): Promise<UserModel>
  getUserByEmail(contestId: string, email: string): Promise<UserModel>
  getUserByUsername(contestId: string, username: string): Promise<UserModel>
  getUserByToken(token: string): Promise<UserModel>
  putUser(user: UserModel): Promise<UserModel>
}
