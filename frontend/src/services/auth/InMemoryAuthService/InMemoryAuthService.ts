import { ServerStatusService } from 'ugrade/services/serverStatus/ServerStatusService'
import { AuthService } from '../AuthService'
import {
  AuthError,
  ForbiddenActionError,
  UserRegistrationError,
} from '../errors'
import { User } from '../User'
import { contestUserMap, userPasswordMap } from './fixtures'

export class InMemoryAuthService implements AuthService {
  private serverStatusService: ServerStatusService
  private userPasswordMap: { [id: string]: string }
  private usersToken: { [id: string]: string }

  private contestUserMap: { [contestId: string]: { [userId: string]: User } }

  constructor(serverStatusService: ServerStatusService) {
    this.contestUserMap = contestUserMap
    this.userPasswordMap = userPasswordMap
    this.usersToken = {}
    this.serverStatusService = serverStatusService
  }

  async getUserByEmail(contestId: string, email: string): Promise<User> {
    await this.serverStatusService.ping()
    const userMap = this.contestUserMap[contestId]
    if (!userMap) throw new AuthError('No Such Contest')
    const user = Object.keys(userMap)
      .map(k => userMap[k])
      .filter(x => x.email === email)
      .pop()
    if (!user) throw new AuthError('No Such User')
    return user
  }

  async signin(
    contestId: string,
    email: string,
    password: string
  ): Promise<string> {
    await this.serverStatusService.ping()
    const userMap = this.contestUserMap[contestId]
    if (!userMap) throw new AuthError('No Such Contest')
    const user = Object.keys(userMap)
      .map(k => userMap[k])
      .filter(x => x.email === email)
      .pop()
    if (!user) throw new AuthError('Wrong Email Or Password')
    if (this.userPasswordMap[user.id] !== password) {
      throw new AuthError('Wrong Email Or Password')
    }
    const token = `${contestId}---${user.id}---somefaketoken`
    this.usersToken[user.id] = token
    return token
  }

  async signup(
    contestId: string,
    username: string,
    email: string,
    oneTimeCode: string,
    password: string,
    name: string
  ): Promise<string> {
    await this.serverStatusService.ping()
    const userMap = this.contestUserMap[contestId]
    if (!userMap) throw new AuthError('No Such Contest')
    const user = Object.keys(userMap)
      .map(k => userMap[k])
      .filter(x => x.email === email)
      .pop()
    if (!user) throw new ForbiddenActionError('Operation Not Allowed')
    if (oneTimeCode !== '00000000') throw new AuthError('Wrong One Time Code')
    if (user.username && user.username.length > 0) {
      throw new UserRegistrationError('User Already Registered')
    }
    if (
      Object.keys(userMap)
        .map(k => userMap[k])
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
    return this.signin(contestId, email, password)
  }

  async forgotPassword(contestId: string, email: string): Promise<void> {
    await this.serverStatusService.ping()
    if (!this.contestUserMap[contestId]) {
      throw new AuthError('No Such Contest')
    }
    if (email.length === 0) {
      throw new AuthError('No Such User')
    }
  }

  async resetPassword(
    contestId: string,
    email: string,
    oneTimeCode: string,
    password: string
  ): Promise<void> {
    await this.serverStatusService.ping()
    const userMap = this.contestUserMap[contestId]
    if (!userMap) {
      throw new AuthError('No Such Contest')
    }
    const user = Object.keys(userMap)
      .map(k => userMap[k])
      .filter(val => val.email === email)
      .pop()
    if (!user) throw new AuthError('No Such User')
    if (user.username.length === 0) {
      throw new AuthError('User Is Not Signed Up Yet')
    }
    if (oneTimeCode !== '00000000') throw new AuthError('Wrong One Time Code')
    this.userPasswordMap[user.id] = password
  }

  async getMe(token: string): Promise<User> {
    await this.serverStatusService.ping()
    const matches = token.match(/^([a-zA-Z0-9_]+)---([a-zA-Z0-9_]+)---(.+)$/)
    if (matches) {
      const contestId = matches[1]
      const userId = matches[2]
      const contest = this.contestUserMap[contestId]
      if (!contest) throw new AuthError('Invalid Token')
      const user = contest[userId]
      if (!user) throw new AuthError('Invalid Token')
      return user
    }
    throw new AuthError('Invalid Token')
  }

  async setMyPassword(
    token: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.getMe(token)
    if (this.userPasswordMap[user.id] !== oldPassword) {
      throw new AuthError('Wrong Password')
    }
    this.userPasswordMap[user.id] = newPassword
  }

  async setMyName(token: string, name: string): Promise<void> {
    const user = await this.getMe(token)
    this.contestUserMap[user.contestId][user.id].name = name
  }

  async registerContestAdmin(contestId: string, email: string): Promise<User> {
    const newUser: User = {
      id: Math.round(Math.random() * 100000).toString(),
      contestId,
      username: '',
      email,
      name: '',
    }
    this.contestUserMap[contestId] = {
      [newUser.id]: newUser,
    }
    return newUser
  }
}
