import lodash from 'lodash'
import { AuthService } from 'ugrade/auth'
import { LanguageService, NoSuchLanguage } from 'ugrade/language'
import { Contest } from '../contest'
import { ContestIdTaken } from '../ContestIdTaken'
import { NoSuchContest } from '../NoSuchContest'
import { ContestService } from '../service'
import { contestServiceValidator as validator } from '../validations'
import { contests as contestFixture } from './fixture'
import { genId } from './util'

export class InMemoryContestService implements ContestService {
  private languageService: LanguageService
  private authService: AuthService
  private contests: Contest[]
  private contestId: { [id: string]: Contest }
  private contestShortId: { [shortId: string]: Contest }

  constructor(
    authService: AuthService,
    languageService: LanguageService,
    contests: Contest[] = contestFixture
  ) {
    this.authService = authService
    this.languageService = languageService
    this.contests = lodash.cloneDeep(contests)
    this.contestId = {}
    this.contestShortId = {}
    for (const contest of this.contests) {
      this.contestId[contest.id] = contest
      this.contestShortId[contest.shortId] = contest
    }
  }

  async getContestById(contestId: string): Promise<Contest> {
    await validator.getContestById(contestId)
    if (this.contestId[contestId]) {
      return lodash.cloneDeep(this.contestId[contestId])
    }
    throw new NoSuchContest()
  }

  async getContestByShortId(shortId: string): Promise<Contest> {
    await validator.getContestByShortId(shortId)
    if (this.contestShortId[shortId]) {
      return lodash.cloneDeep(this.contestShortId[shortId])
    }
    throw new NoSuchContest()
  }

  async createContest(
    email: string,
    shortId: string,
    name: string,
    shortDescription: string,
    description: string,
    startTime: Date,
    finishTime: Date,
    permittedLanguageIds: string[]
  ): Promise<Contest> {
    await validator.createContest(
      email,
      shortId,
      name,
      shortDescription,
      description,
      startTime,
      finishTime,
      permittedLanguageIds
    )

    // check taken shortId
    try {
      await this.getContestByShortId(shortId)
      throw new ContestIdTaken()
    } catch (error) {
      if (!(error instanceof NoSuchContest)) throw error
    }

    // check languages ids
    const availableLangs = await this.languageService.getAllLanguages()
    const availableLangIds = availableLangs.map(lang => lang.id)
    for (const langId of permittedLanguageIds || []) {
      if (!availableLangIds.includes(langId)) {
        throw new NoSuchLanguage()
      }
    }

    // add admin to the auth service
    const newContest = {
      id: genId(),
      shortId,
      name,
      shortDescription,
      description,
      startTime,
      freezed: false,
      finishTime,
      permittedLanguageIds,
    }
    await this.authService.addContest(email, newContest.id)

    // save contest
    this.contests.push(newContest)
    this.contestId[newContest.id] = newContest
    this.contestShortId[newContest.shortId] = newContest

    return lodash.clone(newContest)
  }

  async setMyContest(
    token: string,
    name: string,
    shortDescription: string,
    description: string,
    startTime: Date,
    freezed: boolean,
    finishTime: Date,
    permittedLanguageIds: string[]
  ): Promise<Contest> {
    await validator.setMyContest(
      token,
      name,
      shortDescription,
      description,
      startTime,
      freezed,
      finishTime,
      permittedLanguageIds
    )

    // get currrent contest
    const me = await this.authService.getMe(token)
    const contest = await this.getContestById(me.contestId)

    // check languages ids
    const availableLangs = await this.languageService.getAllLanguages()
    const availableLangIds = availableLangs.map(lang => lang.id)
    for (const langId of permittedLanguageIds || []) {
      if (!availableLangIds.includes(langId)) {
        throw new NoSuchLanguage()
      }
    }

    // update the contest
    this.contestId[contest.id].name = name
    this.contestId[contest.id].shortDescription = shortDescription
    this.contestId[contest.id].description = description
    this.contestId[contest.id].startTime = startTime
    this.contestId[contest.id].freezed = freezed
    this.contestId[contest.id].finishTime = finishTime
    this.contestId[contest.id].permittedLanguageIds = permittedLanguageIds

    return lodash.cloneDeep(this.contestId[contest.id])
  }
}
