import lodash from 'lodash'
import { UserPermission } from 'ugrade/auth/store'
import { ServerStatusService } from 'ugrade/services/serverStatus/ServerStatusService'
import { AuthService } from '../AuthService'
import {
  AuthError,
  ForbiddenActionError,
  InvalidTokenError,
  NoSuchUserError,
  UserAlreadyAddedError,
  UserRegistrationError,
} from '../errors'
import { User } from '../User'
import { adminPermissions } from '../UserPermission'
import { contestUserMap, userPasswordMap } from './fixtures'

export class InMemoryAuthService implements AuthService {
  public serverStatusService: ServerStatusService
  public userPasswordMap: { [id: string]: string }
  public usersToken: { [id: string]: string }

  public contestUserMap: { [contestId: string]: { [userId: string]: User } }

  constructor(serverStatusService: ServerStatusService) {
    this.contestUserMap = contestUserMap
    this.userPasswordMap = userPasswordMap
    this.usersToken = {}
    this.serverStatusService = serverStatusService
  }

  async getUserById(userId: string): Promise<User> {
    await this.serverStatusService.ping()
    for (const map of lodash.values(this.contestUserMap)) {
      if (map[userId]) return lodash.cloneDeep(map[userId])
    }
    throw new NoSuchUserError('No Such User')
  }

  async getUsers(_token: string, contestId: string): Promise<User[]> {
    await this.serverStatusService.ping()
    const userMap = this.contestUserMap[contestId]
    if (!userMap) throw new AuthError('No Such Contest')
    return lodash.cloneDeep(lodash.values(userMap))
  }

  async getUserByEmail(contestId: string, email: string): Promise<User> {
    await this.serverStatusService.ping()
    const userMap = this.contestUserMap[contestId]
    if (!userMap) throw new AuthError('No Such Contest')
    const user = lodash
      .values(userMap)
      .filter(x => x.email === email)
      .pop()
    if (!user) throw new AuthError('No Such User')
    return user
  }

  async getUserByUsernames(contestId: string, usernames: string[]): Promise<User[]> {
    await this.serverStatusService.ping()
    const userMap = this.contestUserMap[contestId]
    if (!userMap) throw new AuthError('No Such Contest')
    const users = lodash
      .values(userMap)
      .filter(us => usernames.includes(us.username))
      .slice()
    return users
  }

  async signin(contestId: string, email: string, password: string): Promise<string> {
    await this.serverStatusService.ping()
    const userMap = this.contestUserMap[contestId]
    if (!userMap) throw new AuthError('No Such Contest')
    const user = lodash
      .values(userMap)
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
    const user = lodash
      .values(userMap)
      .filter(x => x.email === email)
      .pop()
    if (!user) throw new ForbiddenActionError('Operation Not Allowed')
    if (oneTimeCode !== '00000000') throw new AuthError('Wrong One Time Code')
    if (user.username && user.username.length > 0) {
      throw new UserRegistrationError('User Already Registered')
    }
    if (
      lodash
        .values(userMap)
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

  async resetPassword(contestId: string, email: string, oneTimeCode: string, password: string): Promise<void> {
    await this.serverStatusService.ping()
    const userMap = this.contestUserMap[contestId]
    if (!userMap) {
      throw new AuthError('No Such Contest')
    }
    const user = lodash
      .values(userMap)
      .filter(val => val.email === email)
      .pop()
    if (!user) throw new AuthError('No Such User')
    if (user.username.length === 0) {
      throw new AuthError('User Is Not Signed Up Yet')
    }
    if (oneTimeCode !== '00000000') throw new AuthError('Wrong One Time Code')
    this.userPasswordMap[user.id] = password
  }

  async addUser(token: string, users: Array<{ email: string; permissions: UserPermission[] }>): Promise<string[]> {
    const me = await this.getMe(token)
    if (!me.permissions.includes(UserPermission.UsersInvite)) {
      throw new ForbiddenActionError(`User Doesn't Have Permission To Invite Other Users`)
    }

    const userMap = this.contestUserMap[me.contestId]
    const currentEmails = lodash.values(userMap).map(u => u.email)
    const newEmails = users.map(u => u.email)
    if (lodash.intersection(currentEmails, newEmails).length > 0) {
      throw new UserAlreadyAddedError(`User's Email Already Added`)
    }

    if (!me.permissions.includes(UserPermission.UsersPermissionsUpdate)) {
      throw new ForbiddenActionError(`User's doesn't Have Permission To Update User's Permissions`)
    }

    const req = lodash.union(...users.map(u => u.permissions))
    for (const reqPerm of req) {
      if (!me.permissions.includes(reqPerm)) {
        throw new ForbiddenActionError(`User's doesn't Have Permission To Give User's ${reqPerm}`)
      }
    }

    for (const user of users) {
      const newId = Math.round(Math.random() * 100000).toString()
      userMap[newId] = {
        id: newId,
        contestId: me.contestId,
        username: '',
        email: user.email,
        permissions: user.permissions,
        name: '',
      }
    }

    return lodash.cloneDeep(users.map(u => u.email))
  }

  async getMe(token: string): Promise<User> {
    await this.serverStatusService.ping()
    const matches = token.match(/^([a-zA-Z0-9_]+)---([a-zA-Z0-9_]+)---(.+)$/)
    if (matches) {
      const contestId = matches[1]
      const userId = matches[2]
      const contest = this.contestUserMap[contestId]
      if (!contest) throw new InvalidTokenError('Invalid Token')
      const user = contest[userId]
      if (!user) throw new InvalidTokenError('Invalid Token')
      return user
    }
    throw new InvalidTokenError('Invalid Token')
  }

  async setMyPassword(token: string, oldPassword: string, newPassword: string): Promise<void> {
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

  async setUserPermissions(token: string, userId: string, permissions: UserPermission[]): Promise<UserPermission[]> {
    const me = await this.getMe(token)
    if (!me.permissions.includes(UserPermission.UsersPermissionsUpdate)) {
      throw new ForbiddenActionError(`User's doesn't Have Permission To Update User's Permissions`)
    }

    for (const p of permissions) {
      if (!me.permissions.includes(p)) {
        throw new ForbiddenActionError(`User's doesn't Have ${p} Permission`)
      }
    }

    const user = await this.getUserById(userId)
    user.permissions = lodash.cloneDeep(permissions)
    this.contestUserMap[user.contestId][user.id] = user

    return lodash.cloneDeep(user.permissions)
  }

  async registerContestAdmin(contestId: string, email: string): Promise<User> {
    const newUser: User = {
      id: Math.round(Math.random() * 100000).toString(),
      contestId,
      username: '',
      email,
      name: '',
      permissions: adminPermissions.slice(),
    }
    this.contestUserMap[contestId] = {
      [newUser.id]: newUser,
    }
    return newUser
  }
}
