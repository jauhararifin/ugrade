import { ContestStore } from '../store'
import lodash from 'lodash'
import { NoSuchContest } from '../NoSuchContest'
import { ContestModel } from '../model'

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
}
