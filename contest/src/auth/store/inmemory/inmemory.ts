import lodash from 'lodash'
import { UserModel } from '../model'
import { NoSuchUser } from '../NoSuchUser'
import { AuthStore } from '../store'

export class InMemoryAuthStore implements AuthStore {
  private users: UserModel[]
  private userId: { [id: string]: UserModel }
  private userEmail: { [eid: string]: UserModel }
  private userUsername: { [uid: string]: UserModel }
  private userToken: { [token: string]: UserModel }

  constructor(users: UserModel[]) {
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

  async getUserById(id: string): Promise<UserModel> {
    if (this.userId[id]) {
      return lodash.cloneDeep(this.userId[id])
    }
    throw new NoSuchUser('No Such User')
  }

  async getUserByEmail(contestId: string, email: string): Promise<UserModel> {
    const key = `${contestId}/${email}`
    if (this.userEmail[key]) {
      return lodash.cloneDeep(this.userEmail[key])
    }
    throw new NoSuchUser('No Such User')
  }

  async getUserByUsername(
    contestId: string,
    username: string
  ): Promise<UserModel> {
    const key = `${contestId}/${username}`
    if (this.userUsername[key]) {
      return lodash.cloneDeep(this.userUsername[key])
    }
    throw new NoSuchUser('No Such User')
  }

  async getUserByToken(token: string): Promise<UserModel> {
    if (this.userToken[token]) {
      return lodash.cloneDeep(this.userToken[token])
    }
    throw new NoSuchUser('No Such User')
  }

  async putUser(user: UserModel): Promise<UserModel> {
    const newUser = lodash.cloneDeep(user)
    let inserted = false
    let oldUser = undefined as UserModel | undefined
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === newUser.id) {
        oldUser = this.users[i]
        this.users[i] = newUser
        inserted = true
        break
      }
    }
    if (!inserted) this.users.push(newUser)

    this.userId[newUser.id] = newUser
    this.userEmail[`${newUser.contestId}/${newUser.email}`] = newUser
    if (newUser.username.length > 0) {
      this.userUsername[`${newUser.contestId}/${newUser.username}`] = newUser
    }

    if (oldUser && oldUser.token.length > 0) {
      delete this.userToken[oldUser.token]
    }
    if (newUser.token.length > 0) this.userToken[newUser.token] = newUser

    return lodash.cloneDeep(this.userId[newUser.id])
  }
}
