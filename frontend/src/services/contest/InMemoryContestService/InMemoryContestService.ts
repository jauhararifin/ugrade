import lodash from 'lodash'
import loremIpsum from 'lorem-ipsum'
import { ForbiddenActionError, User } from 'ugrade/services/auth'
import { InMemoryAuthService } from 'ugrade/services/auth/InMemoryAuthService'
import { NoSuchProblem } from 'ugrade/services/problem'
import { ServerStatusService } from 'ugrade/services/serverStatus'
import { Announcement } from '../Announcement'
import { Clarification, ClarificationEntry } from '../Clarification'
import { Contest, Language } from '../Contest'
import {
  ContestService,
  SubscriptionCallback,
  UnsubscriptionFunction,
} from '../ContestService'
import { ContestIdTaken, NoSuchClarification, NoSuchContest } from '../errors'
import { NoSuchLanguage } from '../errors/NoSuchLanguage'
import { GradingVerdict } from '../Grading'
import { Scoreboard, ScoreboardProblemScore } from '../Scoreboard'
import { Submission } from '../Submission'
import {
  contestAnnouncementsMap,
  contestProblemsMap,
  contests,
  languages,
} from './fixtures'

export class InMemoryContestService implements ContestService {
  private authService: InMemoryAuthService
  private serverStatusService: ServerStatusService

  private contests: Contest[] = []
  private contestProblemsMap: { [id: string]: string[] } = {}
  private contestAnnouncementsMap: { [id: string]: Announcement[] } = {}
  private contestClarificationsMap: { [id: string]: Clarification[] } = {}
  private contestSubmissionsMap: { [id: string]: Submission[] } = {}

  private contestScoreboardMap: { [id: string]: Scoreboard } = {}

  private languages: { [id: string]: Language } = {}

  constructor(
    serverStatusService: ServerStatusService,
    authService: InMemoryAuthService
  ) {
    this.serverStatusService = serverStatusService
    this.authService = authService

    this.contests = contests.slice()
    this.contestProblemsMap = { ...contestProblemsMap }
    this.contestAnnouncementsMap = { ...contestAnnouncementsMap }

    for (const contest of this.contests) {
      this.contestClarificationsMap[contest.id] = [
        {
          id: Math.round(Math.random() * 100000).toString(),
          title: loremIpsum({ count: 4, units: 'words' }),
          subject: 'General Issue',
          issuedTime: new Date(),
          entries: [
            {
              id: Math.round(Math.random() * 100000).toString(),
              sender: 'test',
              read: true,
              issuedTime: new Date(),
              content: loremIpsum({ count: 1, units: 'paragraphs' }),
            },
          ],
        },
      ]

      const genDefaultProbScore = () => {
        const result: { [id: string]: ScoreboardProblemScore } = {}
        for (const problemId of this.contestProblemsMap[contest.id]) {
          result[problemId] = {
            problemId,
            attempt: 0,
            penalty: 0,
            passed: false,
            frozen: false,
            first: false,
          }
        }
        return result
      }
      this.contestScoreboardMap[contest.id] = {
        contestId: contest.id,
        lastUpdated: new Date(),
        entries: [
          'test',
          'newtest',
          'lorem',
          'ipsum',
          'dos',
          'color',
          'sit',
          'amet',
        ].map(uname => ({
          rank: 1,
          contestant: uname,
          totalPassed: 0,
          totalPenalty: 0,
          problemScores: genDefaultProbScore(),
        })),
      }
    }

    this.languages = languages

    this.handleSubs().catch(_ => null)
  }

  async handleSubs() {
    setInterval(() => {
      for (const contest of this.contests) {
        // add announcements
        const newAnnouncement: Announcement = {
          id: Math.round(Math.random() * 100000).toString(),
          title: loremIpsum({ count: 4, units: 'words' }),
          content: loremIpsum({ count: 1, units: 'paragraphs' }),
          issuedTime: new Date(Date.now()),
          read: false,
        }
        this.contestAnnouncementsMap[contest.id].push(newAnnouncement)

        // shift problems
        if (!this.contestProblemsMap[contest.id]) {
          this.contestProblemsMap[contest.id] = []
        }
        const problemArr = this.contestProblemsMap[contest.id]
        if (problemArr.length > 0) {
          const temp = problemArr.shift()
          if (temp) problemArr.push(temp)
        }

        // add clarifcation entries
        const clarifArr = this.contestClarificationsMap[contest.id]
        for (const clarif of clarifArr) {
          const newEntry: ClarificationEntry = {
            id: Math.round(Math.random() * 100000).toString(),
            sender: 'jury',
            content: loremIpsum({ count: 1, units: 'paragraphs' }),
            read: false,
            issuedTime: new Date(),
          }
          clarif.entries.push(newEntry)
        }

        // add submissions
        if (!this.contestSubmissionsMap[contest.id]) {
          this.contestSubmissionsMap[contest.id] = []
        }
        const newSubmission: Submission = {
          id: Math.round(Math.random() * 100000).toString(),
          issuer: loremIpsum({
            count: 1,
            units: 'words',
            words: [
              'jauhar',
              'arifin',
              'lorem',
              'ipsum',
              'dos',
              'color',
              'sit',
              'amet',
            ],
          }),
          contestId: contest.id,
          problemId: this.contestProblemsMap[contest.id][
            Math.floor(
              Math.random() * this.contestProblemsMap[contest.id].length
            )
          ],
          languageId:
            contest.permittedLanguages[
              Math.floor(Math.random() * contest.permittedLanguages.length)
            ].id,
          issuedTime: new Date(),
          verdict: GradingVerdict.Pending,
          sourceCode: 'https://pastebin.com/raw/YDhf1cUV',
          gradings: [
            {
              id: Math.round(Math.random() * 100000).toString(),
              issuedTime: new Date(),
              verdict: GradingVerdict.InternalError,
              message: '',
              compilationOutput:
                'https://raw.githubusercontent.com/jauhararifin/cp/master/TODO',
            },
            {
              id: Math.round(Math.random() * 100000).toString(),
              issuedTime: new Date(),
              verdict: GradingVerdict.WrongAnswer,
              message: 'fixing compiler in worker',
              compilationOutput:
                'https://raw.githubusercontent.com/jauhararifin/cp/master/.gitignore',
            },
            {
              id: Math.round(Math.random() * 100000).toString(),
              issuedTime: new Date(),
              verdict: GradingVerdict.Accepted,
              message: 'fixing testcases',
              compilationOutput:
                'https://raw.githubusercontent.com/jauhararifin/cp/master/TODO',
            },
          ],
        }
        this.contestSubmissionsMap[contest.id].push(newSubmission)

        // update scoreboard
        const scoreboard = this.contestScoreboardMap[contest.id]
        scoreboard.lastUpdated = new Date()
        const entr = Math.floor(Math.random() * scoreboard.entries.length)
        const prob = problemArr[Math.floor(Math.random() * problemArr.length)]
        const probScore = scoreboard.entries[entr].problemScores[prob]
        probScore.attempt++
        probScore.first = Math.random() > 0.5
        probScore.frozen = Math.random() > 0.5
        probScore.passed = Math.random() > 0.5
        probScore.penalty += Math.round(Math.random() * 120)
        const probS = lodash.values(scoreboard.entries[entr].problemScores)
        scoreboard.entries[entr].totalPassed = probS.filter(
          p => p.passed
        ).length
        scoreboard.entries[entr].totalPenalty = lodash.sum(
          probS.map(s => s.penalty)
        )
        scoreboard.entries.sort((a, b) => {
          if (a.totalPassed === b.totalPassed) {
            return a.totalPenalty - b.totalPenalty
          }
          return b.totalPassed - a.totalPassed
        })
        let lastRank = 0
        let lastPassed = -1
        let lastPenalty = -1
        for (const en of scoreboard.entries) {
          if (
            en.totalPassed !== lastPassed ||
            en.totalPenalty !== lastPenalty
          ) {
            lastRank++
          }
          en.rank = lastRank
          lastPassed = en.totalPassed
          lastPenalty = en.totalPenalty
        }
      }
    }, 5000)
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
    const contest = contests
      .slice()
      .filter(x => x.id === user.contestId)
      .pop()
    if (contest) return lodash.cloneDeep(contest)
    throw new NoSuchContest('No Such Contest')
  }

  subscribeMyContest(
    token: string,
    callback: SubscriptionCallback<Contest>
  ): UnsubscriptionFunction {
    let lastMyContest = undefined as Contest | undefined
    const timeout = setInterval(async () => {
      const myContest = await this.getMyContest(token)
      if (!lodash.isEqual(myContest, lastMyContest)) {
        callback(myContest)
        lastMyContest = myContest
      }
    }, 5500)
    this.getMyContest(token)
      .then(contest => {
        lastMyContest = contest
        return contest
      })
      .then(callback)
      .catch(_ => null)
    return () => {
      clearInterval(timeout)
    }
  }

  async getAnnouncements(token: string): Promise<Announcement[]> {
    const contest = await this.getMyContest(token)
    return lodash.cloneDeep(this.contestAnnouncementsMap[contest.id])
  }

  subscribeAnnouncements(
    token: string,
    callback: SubscriptionCallback<Announcement[]>
  ): UnsubscriptionFunction {
    const timeout = setInterval(async () => {
      const announcements = await this.getAnnouncements(token)
      callback(announcements)
    }, 5500)
    this.getAnnouncements(token)
      .then(callback)
      .catch(_ => null)
    return () => {
      clearInterval(timeout)
    }
  }

  async readAnnouncements(token: string, id: string[]): Promise<void> {
    const contest = await this.getMyContest(token)
    this.contestAnnouncementsMap[contest.id]
      .filter(i => id.includes(i.id))
      .forEach(val => (val.read = true))
  }

  async getProblemIds(token: string): Promise<string[]> {
    const contest = await this.getMyContest(token)
    return lodash.cloneDeep(this.contestProblemsMap[contest.id])
  }

  subscribeProblemIds(
    token: string,
    callback: SubscriptionCallback<string[]>
  ): UnsubscriptionFunction {
    const timeout = setInterval(async () => {
      const ids = await this.getProblemIds(token)
      callback(ids)
    }, 5500)
    this.getProblemIds(token)
      .then(callback)
      .catch(_ => null)
    return () => {
      clearInterval(timeout)
    }
  }

  async getClarifications(token: string): Promise<Clarification[]> {
    const contest = await this.getMyContest(token)
    return lodash.cloneDeep(this.contestClarificationsMap[contest.id])
  }

  subscribeClarifications(
    token: string,
    callback: SubscriptionCallback<Clarification[]>
  ): UnsubscriptionFunction {
    const timeout = setInterval(async () => {
      const clarifs = await this.getClarifications(token)
      callback(clarifs)
    }, 5500)
    this.getClarifications(token)
      .then(callback)
      .catch(_ => null)
    return () => {
      clearInterval(timeout)
    }
  }

  async createClarification(
    token: string,
    title: string,
    subject: string,
    content: string
  ): Promise<Clarification> {
    const user = await this.authService.getMe(token)
    const contest = await this.getMyContest(token)
    const clarification: Clarification = {
      id: Math.round(Math.random() * 100000).toString(),
      title,
      subject,
      issuedTime: new Date(),
      entries: [
        {
          id: Math.round(Math.random() * 100000).toString(),
          sender: user.username,
          content,
          read: true,
          issuedTime: new Date(),
        },
      ],
    }

    this.contestClarificationsMap[contest.id].push(clarification)
    return lodash.cloneDeep(clarification)
  }

  async createClarificationEntry(
    token: string,
    clarificationId: string,
    content: string
  ): Promise<Clarification> {
    const user = await this.authService.getMe(token)
    const contest = await this.getMyContest(token)

    if (new Date() >= contest.finishTime) {
      throw new ForbiddenActionError('Contest Already Finished')
    }

    const clarification = lodash
      .values(this.contestClarificationsMap[contest.id])
      .filter(c => c.id === clarificationId)
      .pop()

    if (!clarification) {
      throw new NoSuchClarification('No Such Clarification')
    }

    clarification.entries.push({
      id: Math.round(Math.random() * 100000).toString(),
      sender: user.username,
      issuedTime: new Date(),
      read: true,
      content,
    })
    return lodash.cloneDeep(clarification)
  }

  async readClarificationEntries(
    token: string,
    clarificationId: string,
    entryIds: string[]
  ): Promise<Clarification> {
    await this.authService.getMe(token)
    const contest = await this.getMyContest(token)

    const clarification = lodash.find(
      this.contestClarificationsMap[contest.id],
      c => c.id === clarificationId
    )

    if (!clarification) {
      throw new NoSuchClarification('No Such Clarification')
    }

    clarification.entries.forEach(entry => {
      if (entryIds.includes(entry.id)) {
        entry.read = true
      }
    })
    return lodash.cloneDeep(clarification)
  }

  async getSubmissions(token: string): Promise<Submission[]> {
    const contest = await this.getMyContest(token)
    if (!this.contestSubmissionsMap[contest.id]) {
      this.contestSubmissionsMap[contest.id] = []
    }
    return lodash.cloneDeep(this.contestSubmissionsMap[contest.id])
  }

  subscribeSubmissions(
    token: string,
    callback: SubscriptionCallback<Submission[]>
  ): UnsubscriptionFunction {
    const timeout = setInterval(async () => {
      const submissions = await this.getSubmissions(token)
      callback(submissions)
    }, 5500)
    this.getSubmissions(token)
      .then(callback)
      .catch(_ => null)
    return () => {
      clearInterval(timeout)
    }
  }

  async submitSolution(
    token: string,
    problemId: string,
    languageId: string,
    sourceCode: string
  ): Promise<Submission> {
    const me = await this.authService.getMe(token)
    const contest = await this.getMyContest(token)
    if (new Date() >= contest.finishTime) {
      throw new ForbiddenActionError('Contest Already Finished')
    }
    const language = contest.permittedLanguages
      .filter(lang => lang.id === languageId)
      .pop()
    if (!language) {
      throw new NoSuchLanguage('No Such Language')
    }
    const problems = this.contestProblemsMap[contest.id].slice()
    if (!problems.includes(problemId)) {
      throw new NoSuchProblem('No Such Problem')
    }

    const submissionDetail: Submission = {
      id: Math.round(Math.random() * 100000).toString(),
      issuer: me.username,
      contestId: contest.id,
      problemId,
      languageId,
      issuedTime: new Date(),
      verdict: GradingVerdict.Pending,
      sourceCode,
      gradings: [
        {
          id: Math.round(Math.random() * 100000).toString(),
          issuedTime: new Date(),
          verdict: GradingVerdict.Accepted,
          message: '',
          compilationOutput: 'some compilation output here',
        },
        {
          id: Math.round(Math.random() * 100000).toString(),
          issuedTime: new Date(Date.now()),
          verdict: GradingVerdict.Pending,
          message: '',
          compilationOutput: '',
        },
      ],
    }

    if (!this.contestSubmissionsMap[contest.id]) {
      this.contestSubmissionsMap[contest.id] = []
    }
    this.contestSubmissionsMap[contest.id].push(submissionDetail)
    return lodash.cloneDeep(submissionDetail)
  }

  async getScoreboard(token: string): Promise<Scoreboard> {
    const contest = await this.getMyContest(token)
    return lodash.cloneDeep(this.contestScoreboardMap[contest.id])
  }

  subscribeScoreboard(
    token: string,
    callback: SubscriptionCallback<Scoreboard>
  ): UnsubscriptionFunction {
    let lastScoreboard = undefined as Scoreboard | undefined
    const timeout = setInterval(async () => {
      const scoreboard = await this.getScoreboard(token)
      if (!lodash.isEqual(scoreboard, lastScoreboard)) {
        callback(scoreboard)
        lastScoreboard = scoreboard
      }
    }, 5500)
    this.getScoreboard(token)
      .then(scoreboard => {
        lastScoreboard = scoreboard
        return scoreboard
      })
      .then(callback)
      .catch(_ => null)
    return () => {
      clearInterval(timeout)
    }
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
