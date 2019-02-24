import { User } from './User'

export interface AuthService {
  isRegistered(contestId: string, email: string): Promise<boolean>

  signin(contestId: string, email: string, password: string): Promise<string>

  signup(
    contestId: string,
    username: string,
    email: string,
    oneTimeCode: string,
    password: string,
    name: string
  ): Promise<string>

  forgotPassword(contestId: string, usernameOrEmail: string): Promise<void>

  getMe(token: string): Promise<User>

  setMyPassword(
    token: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void>

  setMyName(token: string, name: string): Promise<void>
}
