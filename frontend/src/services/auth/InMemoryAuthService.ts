import { AuthService } from './AuthService'
import {
  AuthenticationError,
  ForbiddenActionError,
  UserRegistrationError,
} from './errors'
import { contestUserMap, userPasswordMap } from './fixtures'
import { User } from './User'

export class InMemoryAuthService implements AuthService {
  private userPasswordMap: { [id: string]: string }
  private usersToken: { [id: string]: string }

  private contestUserMap: { [contestId: string]: { [userId: string]: User } }

  constructor() {
    this.contestUserMap = contestUserMap
    this.userPasswordMap = userPasswordMap
    this.usersToken = {}
  }

  async isRegistered(
    contestId: string,
    usernameOrEmail: string
  ): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const userMap = this.contestUserMap[contestId]
    if (!userMap) throw new AuthenticationError('No Such Contest')
    const user = Object.values(userMap)
      .filter(
        x => x.email === usernameOrEmail || x.username === usernameOrEmail
      )
      .pop()
    return !!user
  }

  async signin(
    contestId: string,
    usernameOrEmail: string,
    password: string
  ): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const userMap = this.contestUserMap[contestId]
    if (!userMap) throw new AuthenticationError('No Such Contest')
    const user = Object.values(userMap)
      .filter(
        x => x.username === usernameOrEmail || x.email === usernameOrEmail
      )
      .pop()
    if (!user) throw new AuthenticationError('Wrong Username Or Password')
    if (this.userPasswordMap[user.id] !== password) {
      throw new AuthenticationError('Wrong Username Or Password')
    }
    const token = `${contestId}---${user.id}---somefaketoken`
    this.usersToken[user.id] = token
    return token
  }

  async signup(
    contestId: string,
    username: string,
    email: string,
    password: string,
    name: string
  ): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const userMap = this.contestUserMap[contestId]
    if (!userMap) throw new AuthenticationError('No Such Contest')
    const user = Object.values(userMap)
      .filter(x => x.email === email)
      .pop()
    if (!user) throw new ForbiddenActionError('Operation Not Allowed')
    if (user.username && user.username.length > 0) {
      throw new UserRegistrationError('User Already Registered')
    }
    if (
      Object.values(userMap)
        .filter(x => x.username === username)
        .pop()
    ) {
      throw new UserRegistrationError('Username Already Taken')
    }
    this.contestUserMap[contestId][user.id] = {
      ...user,
      username,
      name,
    }
    this.userPasswordMap[user.id] = password
    return this.signin(contestId, username, password)
  }

  async forgotPassword(
    contestId: string,
    usernameOrEmail: string
  ): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (!this.contestUserMap[contestId]) {
      throw new AuthenticationError('No Such Contest')
    }
    if (usernameOrEmail.length === 0) {
      throw new AuthenticationError('No Such User')
    }
  }

  async getMe(token: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const matches = token.match(/^([a-zA-Z0-9_]+)---([a-zA-Z0-9_]+)---(.+)$/)
    if (matches) {
      const contestId = matches[1]
      const userId = matches[2]
      const contest = this.contestUserMap[contestId]
      if (!contest) throw new AuthenticationError('Invalid Token')
      const user = contest[userId]
      if (!user) throw new AuthenticationError('Invalid Token')
      return user
    }
    throw new AuthenticationError('Invalid Token')
  }

  async setMyPassword(
    token: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.getMe(token)
    if (this.userPasswordMap[user.id] !== oldPassword) {
      throw new AuthenticationError('Wrong Password')
    }
    this.userPasswordMap[user.id] = newPassword
  }

  async setMyName(token: string, name: string): Promise<void> {
    const user = await this.getMe(token)
    this.contestUserMap[user.contestId][user.id].name = name
  }
}
