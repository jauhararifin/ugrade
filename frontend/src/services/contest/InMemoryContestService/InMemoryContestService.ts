import lodash from 'lodash'
import { User } from 'ugrade/services/auth'
import { InMemoryAuthService } from 'ugrade/services/auth/InMemoryAuthService'
import { ServerStatusService } from 'ugrade/services/serverStatus'
import { simplePublisher } from 'ugrade/utils'
import { Contest, Language } from '../Contest'
import {
  ContestService,
  SubscriptionCallback,
  UnsubscriptionFunction,
} from '../ContestService'
import { ContestIdTaken, NoSuchContest } from '../errors'
import { NoSuchLanguage } from '../errors/NoSuchLanguage'
import { contests, languages } from './fixtures'

export class InMemoryContestService implements ContestService {
  public contests: Contest[] = []
  private authService: InMemoryAuthService
  private serverStatusService: ServerStatusService

  private languages: { [id: string]: Language } = {}

  constructor(
    serverStatusService: ServerStatusService,
    authService: InMemoryAuthService
  ) {
    this.serverStatusService = serverStatusService
    this.authService = authService
    this.languages = languages
    this.contests = contests.slice()
  }

  async getAvailableLanguages(): Promise<Language[]> {
    return lodash.values(this.languages).slice()
  }

  async getContestByShortId(shortId: string): Promise<Contest> {
    await this.serverStatusService.ping()
    const contest = this.contests
      .slice()
      .filter(x => x.shortId === shortId)
      .pop()
    if (!contest) throw new NoSuchContest('No Such Contest')
    return lodash.cloneDeep(contest)
  }

  async getMyContest(token: string): Promise<Contest> {
    const user = await this.authService.getMe(token)
    const contest = this.contests
      .slice()
      .filter(x => x.id === user.contestId)
      .pop()
    if (contest) return lodash.cloneDeep(contest)
    throw new NoSuchContest('No Such Contest')
  }

  async updateContestInfo(
    token: string,
    name?: string,
    shortDescription?: string,
    description?: string,
    startTime?: Date,
    freezed?: boolean,
    finishTime?: Date,
    permittedLanguages?: Language[]
  ): Promise<Contest> {
    const contest = await this.getMyContest(token)
    if (name) contest.name = name
    if (shortDescription) contest.shortDescription = shortDescription
    if (description) contest.description = description
    if (startTime) contest.startTime = startTime
    if (freezed !== undefined) contest.freezed = freezed
    if (finishTime) contest.finishTime = finishTime
    if (permittedLanguages) contest.permittedLanguages = permittedLanguages

    for (const i in this.contests) {
      if (this.contests[i].id === contest.id) {
        this.contests[i] = lodash.cloneDeep(contest)
      }
    }
    return lodash.cloneDeep(contest)
  }

  subscribeMyContest(
    token: string,
    callback: SubscriptionCallback<Contest>
  ): UnsubscriptionFunction {
    return simplePublisher(this.getMyContest.bind(this, token), callback)
  }

  async createContest(
    email: string,
    shortId: string,
    name: string,
    shortDescription: string,
    description: string,
    startTime: Date,
    finishTime: Date,
    permittedLanguages?: string[]
  ): Promise<[Contest, User]> {
    if (!permittedLanguages) permittedLanguages = Object.keys(this.languages)
    if (permittedLanguages.filter(id => !this.languages[id]).pop()) {
      throw new NoSuchLanguage('No Such Language')
    }
    if (this.contests.filter(c => c.shortId === shortId).pop()) {
      throw new ContestIdTaken('Contest ID Already Taken')
    }
    const langs = permittedLanguages.map(id => this.languages[id])

    const newContest: Contest = {
      id: Math.round(Math.random() * 100000).toString(),
      shortId,
      name,
      shortDescription,
      description,
      startTime,
      finishTime,
      freezed: false,
      permittedLanguages: langs,
    }
    this.contests.push(newContest)
    const user = await this.authService.registerContestAdmin(
      newContest.id,
      email
    )
    return lodash.cloneDeep<[Contest, User]>([newContest, user])
  }
}
