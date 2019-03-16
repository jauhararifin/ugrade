import { UserModel } from '../model'
import lodash from 'lodash'
import { UserStore } from '../store'
import { NoSuchUser } from '../NoSuchUser'

export class InMemoryUserStore implements UserStore {
  private users: UserModel[]
  private userId: { [id: string]: UserModel }
  private userEmail: { [eid: string]: UserModel }
  private userUsername: { [uid: string]: UserModel }

  constructor(users: UserModel[]) {
    this.users = lodash.cloneDeep(users)
    this.userId = {}
    this.userEmail = {}
    this.userUsername = {}
    for (const user of this.users) {
      this.userId[user.id] = user
      this.userEmail[`${user.contestId}/${user.email}`] = user
      this.userUsername[`${user.contestId}/${user.username}`] = user
    }
  }

  async getUserById(id: string): Promise<UserModel> {
    if (this.userId[id]) {
      return this.userId[id]
    }
    throw new NoSuchUser('No Such User')
  }

  async getUserByEmail(contestId: string, email: string): Promise<UserModel> {
    const key = `${contestId}/${email}`
    if (this.userEmail[key]) {
      return this.userId[key]
    }
    throw new NoSuchUser('No Such User')
  }

  async getUserByUsername(
    contestId: string,
    username: string
  ): Promise<UserModel> {
    const key = `${contestId}/${username}`
    if (this.userUsername[key]) {
      return this.userId[key]
    }
    throw new NoSuchUser('No Such User')
  }

  async getUsersInContest(contestId: string): Promise<UserModel[]> {
    return lodash.cloneDeep(this.users.filter(u => u.contestId === contestId))
  }
}
