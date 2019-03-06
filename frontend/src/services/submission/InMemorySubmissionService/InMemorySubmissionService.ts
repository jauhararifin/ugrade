import lodash from 'lodash'
import { InMemoryAuthService } from 'ugrade/services/auth/InMemoryAuthService'
import { ContestService } from 'ugrade/services/contest'
import { simplePublisher } from 'ugrade/utils'
import { SubmissionValidationError } from '../errors'
import { SubmissionSubmitError } from '../errors/SubmissionSubmitError'
import { GradingVerdict } from '../Grading'
import { Submission } from '../Submission'
import {
  SubmissionsCallback,
  SubmissionService,
  SubmissionsUnsubscribe,
} from '../SubmissionService'

export class InMemorySubmissionService implements SubmissionService {
  private authService: InMemoryAuthService
  private contestService: ContestService
  private submissionsMap: { [contestId: string]: Submission[] }

  constructor(
    authService: InMemoryAuthService,
    contestService: ContestService
  ) {
    this.authService = authService
    this.contestService = contestService

    this.submissionsMap = {}
  }

  async getSubmissions(token: string): Promise<Submission[]> {
    const me = await this.authService.getMe(token)
    const contestId = me.contestId
    if (!this.submissionsMap[contestId]) {
      this.submissionsMap[contestId] = []
    }
    return lodash.cloneDeep(this.submissionsMap[contestId])
  }

  subscribeSubmissions(
    token: string,
    callback: SubmissionsCallback
  ): SubmissionsUnsubscribe {
    return simplePublisher(this.getSubmissions.bind(this, token), callback)
  }

  async submitSolution(
    token: string,
    problemId: string,
    languageId: string,
    sourceCode: string
  ): Promise<Submission> {
    const me = await this.authService.getMe(token)
    const contest = await this.contestService.getMyContest(token)

    if (new Date() >= contest.finishTime) {
      throw new SubmissionSubmitError('Contest Already Finished')
    }
    const language = contest.permittedLanguages
      .filter(lang => lang.id === languageId)
      .pop()
    if (!language) {
      throw new SubmissionValidationError('No Such Language')
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

    if (!this.submissionsMap[contest.id]) {
      this.submissionsMap[contest.id] = []
    }
    this.submissionsMap[contest.id].push(submissionDetail)
    return lodash.cloneDeep(submissionDetail)
  }
}
