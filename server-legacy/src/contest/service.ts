import { Contest } from './contest'

export interface ContestService {
  getContestById(contestId: string): Promise<Contest>
  getContestByShortId(shortId: string): Promise<Contest>
  createContest(
    email: string,
    shortId: string,
    name: string,
    shortDescription: string,
    description: string,
    startTime: Date,
    finishTime: Date,
    permittedLanguageIds: string[]
  ): Promise<Contest>
  setMyContest(
    token: string,
    name: string,
    shortDescription: string,
    description: string,
    startTime: Date,
    freezed: boolean,
    finishTime: Date,
    permittedLanguageIds: string[]
  ): Promise<Contest>
}
