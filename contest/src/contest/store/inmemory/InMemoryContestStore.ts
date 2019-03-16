import { ContestStore } from '../store'
import { Contest } from '../../contest'
import lodash from 'lodash'
import { NoSuchContest } from '../NoSuchContest'

export class InMemoryContestStore implements ContestStore {
  private contests: Contest[]
  private contestId: { [id: string]: Contest }
  private contestShortId: { [shortId: string]: Contest }

  constructor(contests: Contest[]) {
    this.contests = lodash.cloneDeep(contests)
    this.contestId = {}
    this.contestShortId = {}
    for (const contest of this.contests) {
      this.contestId[contest.id] = contest
      this.contestShortId[contest.shortId] = contest
    }
  }

  async getContestById(id: string): Promise<Contest> {
    if (this.contestId[id]) {
      return lodash.cloneDeep(this.contestId[id])
    }
    throw new NoSuchContest('No Such Contest')
  }

  async getContestByShortId(shortId: string): Promise<Contest> {
    if (this.contestShortId[shortId]) {
      return lodash.cloneDeep(this.contestShortId[shortId])
    }
    throw new NoSuchContest('No Such Contest')
  }
}
