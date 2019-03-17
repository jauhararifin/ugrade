import lodash from 'lodash'
import { ContestIdTaken } from '../ContestIdTaken'
import { ContestModel } from '../model'
import { NoSuchContest } from '../NoSuchContest'
import { ContestStore } from '../store'

export class InMemoryContestStore implements ContestStore {
  private contests: ContestModel[]
  private contestId: { [id: string]: ContestModel }
  private contestShortId: { [shortId: string]: ContestModel }

  constructor(contests: ContestModel[]) {
    this.contests = lodash.cloneDeep(contests)
    this.contestId = {}
    this.contestShortId = {}
    for (const contest of this.contests) {
      this.contestId[contest.id] = contest
      this.contestShortId[contest.shortId] = contest
    }
  }

  async getContestById(id: string): Promise<ContestModel> {
    if (this.contestId[id]) {
      return lodash.cloneDeep(this.contestId[id])
    }
    throw new NoSuchContest('No Such Contest')
  }

  async getContestByShortId(shortId: string): Promise<ContestModel> {
    if (this.contestShortId[shortId]) {
      return lodash.cloneDeep(this.contestShortId[shortId])
    }
    throw new NoSuchContest('No Such Contest')
  }

  async putContest(contest: ContestModel): Promise<ContestModel> {
    const newContest = lodash.cloneDeep(contest)

    const oldContest = this.contestId[newContest.id]
    if (!oldContest) {
      if (this.contestShortId[newContest.shortId]) {
        // inserting but shortId already exists
        throw new ContestIdTaken('Contest ID Already Taken')
      }
    } else if (newContest.shortId !== oldContest.shortId) {
      const otherContest = this.contestShortId[newContest.shortId]
      if (otherContest && otherContest.id !== oldContest.id) {
        // updating, and shortId changed, but already used
        throw new ContestIdTaken('Contest ID Already Taken')
      }
    }

    // insert contest
    if (oldContest) {
      for (let i = 0; i < this.contests.length; i++) {
        if (this.contests[i].id === newContest.id) this.contests[i] = newContest
      }
    } else this.contests.push(newContest)

    // insert id contest mapping
    this.contestId[newContest.id] = newContest

    // insert shortId contest mapping
    if (oldContest) delete this.contestShortId[oldContest.id]
    this.contestShortId[newContest.shortId] = newContest

    return lodash.cloneDeep(newContest)
  }
}
