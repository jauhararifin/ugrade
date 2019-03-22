import lodash from 'lodash'
import { AuthService, ForbiddenAction, Permission } from 'ugrade/auth'
import { ContestService } from 'ugrade/contest'
import { LanguageService, NoSuchLanguage } from 'ugrade/language'
import { ProblemService } from 'ugrade/problem/service'
import { genUUID } from 'ugrade/uuid'
import { NoSuchSubmission } from '../NoSuchSubmission'
import { SubmissionService } from '../service'
import { GradingVerdict, Submission } from '../Submission'
import { submissionServiceValidator as validator } from '../validations'

export class InMemorySubmissionService implements SubmissionService {
  private authService: AuthService
  private contestService: ContestService
  private problemService: ProblemService
  private submissions: Submission[]
  private idSubmission: { [id: string]: Submission }
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
    this.idSubmission = {}
    this.contestSubmissions = {}
    for (const submission of this.submissions) {
      this.idSubmission[submission.id] = submission
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

  async getContestSubmissionById(token: string, contestId: string, submissionId: string): Promise<Submission> {
    await validator.getContestSubmissionById(token, contestId, submissionId)

    // check contest
    const me = await this.authService.getMe(token)
    if (contestId !== me.contestId) {
      throw new ForbiddenAction()
    }

    // check submission exists
    if (!this.idSubmission[submissionId]) throw new NoSuchSubmission()
    const submission = this.idSubmission[submissionId]
    if (submission.contestId !== me.contestId) throw new NoSuchSubmission()
    const canReadAll = me.permissions.includes(Permission.SubmissionsRead)
    if (submission.issuerId !== me.id && !canReadAll) throw new NoSuchSubmission()

    return lodash.cloneDeep(submission)
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
