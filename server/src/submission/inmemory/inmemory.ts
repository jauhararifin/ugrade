import lodash from 'lodash'
import { AuthService, ForbiddenAction, Permission } from 'ugrade/auth'
import { ContestService } from 'ugrade/contest'
import { LanguageService, NoSuchLanguage } from 'ugrade/language'
import { ProblemService } from 'ugrade/problem/service'
import { genUUID } from 'ugrade/uuid'
import { SubmissionService } from '../service'
import { GradingVerdict, Submission } from '../Submission'
import { submissionServiceValidator as validator } from '../validations'

export class InMemorySubmissionService implements SubmissionService {
  private authService: AuthService
  private contestService: ContestService
  private problemService: ProblemService
  private submissions: Submission[]
  private contestSubmissions: { [contestId: string]: Submission[] }

  constructor(
    authService: AuthService,
    contestService: ContestService,
    problemService: ProblemService,
    submissions: Submission[] = []
  ) {
    this.authService = authService
    this.contestService = contestService
    this.problemService = problemService
    this.submissions = lodash.cloneDeep(submissions)
    this.contestSubmissions = {}
    for (const submission of this.submissions) {
      if (!this.contestSubmissions[submission.contestId]) this.contestSubmissions[submission.contestId] = []
      this.contestSubmissions[submission.contestId].push(submission)
    }
  }

  async getContestSubmissions(token: string, contestId: string): Promise<Submission[]> {
    await validator.getContestSubmissions(token, contestId)

    // check contest
    const contest = await this.contestService.getContestById(contestId)
    const me = await this.authService.getMe(token)
    if (contest.id !== me.contestId) {
      throw new ForbiddenAction()
    }

    // filter based on Permission.SubmissionsRead
    if (!this.contestSubmissions[contest.id]) this.contestSubmissions[contest.id] = []
    const canReadAll = me.permissions.includes(Permission.SubmissionsRead)
    const result = this.contestSubmissions[contest.id].filter(s => s.issuerId === me.id || canReadAll)

    return lodash.cloneDeep(result)
  }

  async createSubmission(
    token: string,
    problemId: string,
    languageId: string,
    sourceCode: string
  ): Promise<Submission> {
    await validator.createSubmission(token, problemId, languageId, sourceCode)

    // check permission
    const me = await this.authService.getMe(token)
    if (!me.permissions.includes(Permission.SubmissionsCreate)) throw new ForbiddenAction()

    // check contest & language
    const contest = await this.contestService.getContestById(me.contestId)
    if (!contest.permittedLanguageIds.includes(languageId)) throw new NoSuchLanguage()
    if (contest.id !== me.contestId) {
      throw new ForbiddenAction()
    }

    // check problem
    await this.problemService.getContestProblemById(token, me.contestId, problemId)

    // insert into storage
    const newSubmission: Submission = {
      id: genUUID(),
      issuerId: me.id,
      contestId: me.contestId,
      problemId,
      languageId,
      issuedTime: new Date(),
      verdict: GradingVerdict.Pending,
      sourceCode,
      gradings: [],
    }
    this.submissions.push(newSubmission)
    if (!this.contestSubmissions[newSubmission.contestId]) this.contestSubmissions[newSubmission.contestId] = []
    this.contestSubmissions[newSubmission.contestId].push(newSubmission)

    return lodash.cloneDeep(newSubmission)
  }
}
