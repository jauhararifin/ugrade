import { ContestModel } from './model'

export interface ContestStore {
  getContestById(id: string): Promise<ContestModel>
  getContestByShortId(shortId: string): Promise<ContestModel>
  putContest(contest: ContestModel): Promise<ContestModel>
}
