import { Permission, User } from './user'

export interface AuthService {
  signin(contestId: string, email: string, password: string): Promise<string>
  signup(
    contestId: string,
    username: string,
    email: string,
    oneTimeCode: string,
    password: string,
    name: string
  ): Promise<string>
  forgotPassword(contestId: string, email: string): Promise<User>
  resetPassword(
    contestId: string,
    email: string,
    oneTimeCode: string,
    password: string
  ): Promise<User>
  addUser(
    token: string,
    email: string,
    permissions: Permission[]
  ): Promise<User>
  addContest(email: string, contestId: string): Promise<User>
  setMyPassword(
    token: string,
    oldPassword: string,
    password: string
  ): Promise<User>
  setMyName(token: string, name: string): Promise<User>
  setPermissions(
    token: string,
    userId: string,
    permissions: Permission[]
  ): Promise<User>
  getMe(token: string): Promise<User>
  getUserById(id: string): Promise<User>
  getUserByEmail(contestId: string, email: string): Promise<User>
  getUserByUsername(contestId: string, username: string): Promise<User>

  getUsersInContest(token: string, contestId: string): Promise<User[]>
}
