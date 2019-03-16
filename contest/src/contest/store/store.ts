import { ContestModel } from './model'

export interface ContestStore {
  getContestById(id: string): Promise<ContestModel>
  getContestByShortId(shortId: string): Promise<ContestModel>
}
