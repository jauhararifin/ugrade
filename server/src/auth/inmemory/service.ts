import { compare, hash } from 'bcrypt'
import lodash from 'lodash'
import { AlreadyInvitedUser } from '../AlreadyInvitedUser'
import { AlreadyRegistered } from '../AlreadyRegistered'
import { AlreadyUsedUsername } from '../AlreadyUsedUsername'
import { ForbiddenAction } from '../ForbiddenAction'
import { InvalidCode } from '../InvalidCode'
import { InvalidCredential } from '../InvalidCredential'
import { NoSuchUser } from '../NoSuchUser'
import { AuthService } from '../service'
import { allPermissions, Permission, User } from '../user'
import { authServiceValidator as validator } from '../validations'
import { WrongPassword } from '../WrongPassword'
import { users as usersFixture } from './fixture'
import { genId, genOTC, genToken } from './util'

export class InMemoryAuthService implements AuthService {
  private users: User[]
  private userId: { [id: string]: User }
  private userEmail: { [eid: string]: User }
  private userUsername: { [uid: string]: User }
  private userToken: { [token: string]: User }

  constructor(users: User[] = usersFixture) {
    this.users = lodash.cloneDeep(users)
    this.userId = {}
    this.userEmail = {}
    this.userUsername = {}
    this.userToken = {}
    for (const user of this.users) {
      this.userId[user.id] = user
      this.userEmail[`${user.contestId}/${user.email}`] = user
      if (user.username.length > 0) {
        this.userUsername[`${user.contestId}/${user.username}`] = user
      }
      if (user.token.length > 0) this.userToken[user.token] = user
    }
  }

  async signin(
    contestId: string,
    email: string,
    password: string
  ): Promise<string> {
    // validate input
    await validator.signin(contestId, email, password)

    // check user exists
    let user
    try {
      user = await this.getUserByEmail(contestId, email)
    } catch (error) {
      if (error instanceof NoSuchUser) throw new InvalidCredential()
      throw error
    }

    // check password
    const success = await compare(password, user.password)
    if (success) {
      if (user.token && user.token.length > 0) {
        return user.token
      }
      this.userId[user.id].token = genToken()
      return this.userId[user.id].token
    } else {
      throw new InvalidCredential()
    }
  }

  async signup(
    contestId: string,
    username: string,
    email: string,
    oneTimeCode: string,
    password: string,
    name: string
  ): Promise<string> {
    // validate input
    await validator.signup(
      contestId,
      username,
      email,
      oneTimeCode,
      password,
      name
    )

    const user = await this.getUserByEmail(contestId, email)
    if (user.username !== '') throw new AlreadyRegistered()

    // check signupcode
    if (user.signUpCode && user.signUpCode !== oneTimeCode) {
      throw new InvalidCode()
    }

    // check used username
    try {
      await this.getUserByUsername(user.contestId, user.username)
      throw new AlreadyUsedUsername()
    } catch (error) {
      if (!(error instanceof NoSuchUser)) throw error
    }

    // update user
    this.userId[user.id].token = genToken()
    this.userId[user.id].username = username
    this.userId[user.id].password = await hash(password, 10)
    this.userId[user.id].name = name
    this.userId[user.id].signUpCode = undefined
    this.userId[user.id].resetPasswordCode = undefined

    return this.userId[user.id].token
  }

  async forgotPassword(contestId: string, email: string): Promise<User> {
    const user = await this.getUserByEmail(contestId, email)
    if (!user.resetPasswordCode) {
      this.userId[user.id].resetPasswordCode = genOTC()
    }
    return lodash.cloneDeep(user)
  }

  async resetPassword(
    contestId: string,
    email: string,
    oneTimeCode: string,
    password: string
  ): Promise<User> {
    await validator.resetPassword(contestId, email, oneTimeCode, password)

    // check otc
    const user = await this.getUserByEmail(contestId, email)
    if (user.resetPasswordCode && user.resetPasswordCode !== oneTimeCode) {
      throw new InvalidCode()
    }

    // update user
    this.userId[user.id].password = await hash(password, 10)
    this.userId[user.id].resetPasswordCode = undefined

    return lodash.cloneDeep(this.userId[user.id])
  }

  async addUser(
    token: string,
    email: string,
    permissions: Permission[]
  ): Promise<User> {
    await validator.addUser(token, email, permissions)

    // check user permission
    const user = await this.getMe(token)
    if (!user.permissions.includes(Permission.UsersInvite)) {
      throw new ForbiddenAction()
    }

    // check given permission
    for (const perm of permissions) {
      if (!user.permissions.includes(perm)) {
        throw new ForbiddenAction()
      }
    }

    // check email exists
    try {
      await this.getUserByEmail(user.contestId, email)
      throw new AlreadyInvitedUser()
    } catch (error) {
      if (!(error instanceof NoSuchUser)) throw error
    }

    // update user
    const newUser: User = {
      id: genId(),
      contestId: user.contestId,
      username: '',
      email,
      name: '',
      permissions,
      password: '',
      token: '',
      signUpCode: genOTC(),
    }
    this.users.push(newUser)
    this.userId[newUser.id] = newUser
    this.userEmail[newUser.email] = newUser
    this.userUsername[newUser.username] = newUser
    this.userToken[newUser.token] = newUser

    return lodash.cloneDeep(newUser)
  }

  async addContest(email: string, contestId: string): Promise<User> {
    await validator.addContest(email, contestId)

    const newUser: User = {
      id: genId(),
      contestId,
      username: '',
      email,
      name: '',
      permissions: allPermissions,
      password: '',
      token: '',
      signUpCode: genOTC(),
    }

    for (const user of this.users) {
      if (user.contestId === contestId) {
        throw new ForbiddenAction('Contest Already Exists')
      }
    }

    this.users.push(newUser)
    this.userId[newUser.id] = newUser
    this.userEmail[newUser.email] = newUser
    this.userUsername[newUser.username] = newUser
    this.userToken[newUser.token] = newUser

    return lodash.cloneDeep(newUser)
  }

  async setMyPassword(
    token: string,
    oldPassword: string,
    newPassword: string
  ): Promise<User> {
    await validator.setMyPassword(token, oldPassword, newPassword)

    // check old password
    const user = await this.getMe(token)
    const success = await compare(oldPassword, user.password)
    if (!success) {
      throw new WrongPassword()
    }

    // update user
    this.userId[user.id].password = await hash(newPassword, 10)

    return lodash.cloneDeep(this.userId[user.id])
  }

  async setMyName(token: string, name: string): Promise<User> {
    await validator.setMyName(token, name)
    const user = await this.getMe(token)
    this.userId[user.id].name = name
    return lodash.cloneDeep(this.userId[user.id])
  }

  async setPermissions(
    token: string,
    userId: string,
    permissions: Permission[]
  ): Promise<User> {
    await validator.setPermissions(token, userId, permissions)

    // check user permission
    const user = await this.getMe(token)
    if (!user.permissions.includes(Permission.UsersPermissionsUpdate)) {
      throw new ForbiddenAction()
    }

    // check given permission
    for (const perm of permissions) {
      if (!user.permissions.includes(perm)) {
        throw new ForbiddenAction()
      }
    }

    // check is same contest
    const updateUser = await this.getUserById(userId)
    if (updateUser.contestId !== user.contestId) {
      throw new NoSuchUser()
    }

    // update user
    this.userId[updateUser.id].permissions = permissions
    return lodash.cloneDeep(this.userId[updateUser.id])
  }

  async getMe(token: string): Promise<User> {
    await validator.getMe(token)
    if (this.userToken[token]) return lodash.cloneDeep(this.userToken[token])
    throw new NoSuchUser()
  }

  async getUserById(id: string): Promise<User> {
    await validator.getUserById(id)
    if (this.userId[id]) return lodash.cloneDeep(this.userId[id])
    throw new NoSuchUser()
  }

  async getUserByEmail(contestId: string, email: string): Promise<User> {
    await validator.getUserByEmail(contestId, email)
    if (this.userEmail[`${contestId}/${email}`]) {
      return lodash.cloneDeep(this.userEmail[`${contestId}/${email}`])
    }
    throw new NoSuchUser()
  }

  async getUserByUsername(contestId: string, username: string): Promise<User> {
    await validator.getUserByUsername(contestId, username)
    if (this.userUsername[`${contestId}/${username}`]) {
      return lodash.cloneDeep(this.userUsername[`${contestId}/${username}`])
    }
    throw new NoSuchUser()
  }

  async getUsersInContest(token: string, contestId: string): Promise<User[]> {
    await validator.getUsersInContest(token, contestId)
    const me = await this.getMe(token)
    if (me.contestId !== contestId) throw new ForbiddenAction()
    const users = this.users.filter(u => u.contestId === contestId)
    return lodash.cloneDeep(users)
  }
}
