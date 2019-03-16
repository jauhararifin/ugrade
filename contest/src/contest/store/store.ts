import { Contest } from '../contest'

export interface ContestStore {
  getContestById(id: string): Promise<Contest>
  getContestByShortId(shortId: string): Promise<Contest>
}
