import { GenderType, ShirtSizeType, User } from './User'

export interface AuthService {
  login(username: string, password: string): Promise<string>

  register(
    username: string,
    name: string,
    email: string,
    password: string
  ): Promise<void>

  forgotPassword(usernameOrEmail: string): Promise<void>

  getMe(token: string): Promise<User>

  getMyProfile(token: string): Promise<User>

  setMyProfile(
    token: string,
    name?: string,
    gender?: GenderType,
    shirtSize?: ShirtSizeType,
    address?: string
  ): Promise<User>

  setMyPassword(
    token: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void>
}
