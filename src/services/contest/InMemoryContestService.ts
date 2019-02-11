import { AuthService } from '../auth'
import { Announcement } from './Announcement'
import { Contest } from './Contest'
import { ContestService } from './ContestService'
import { NoSuchContest } from './errors'
import { annoucements, contests } from './fixtures'

export class InMemoryContestService implements ContestService {
  private authService: AuthService
  private contests: Contest[] = []

  constructor(authService: AuthService) {
    this.authService = authService
    this.contests = contests
  }

  async getAllContests(): Promise<Contest[]> {
    await new Promise(resolve => setTimeout(resolve, 1500))
    return this.contests
  }

  async getContestById(id: number): Promise<Contest> {
    await new Promise(resolve => setTimeout(resolve, 1500))
    if (id === 0) throw new Error('Connection Error')

    const contest = contests
      .slice()
      .filter(x => x.id === id)
      .pop()
    if (contest) return contest
    throw new NoSuchContest('No Such Contest')
  }

  async getAccouncementsByContestId(
    contestId: number
  ): Promise<Announcement[]> {
    await new Promise(resolve => setTimeout(resolve, 1500))
    if (contestId === 0) throw new Error('Connection Error')
    return annoucements
  }

  async readAnnouncements(token: string, id: number[]): Promise<void> {
    await this.authService.getMe(token)
    annoucements.filter(i => i.id in id).forEach(val => (val.read = true))
  }
}
