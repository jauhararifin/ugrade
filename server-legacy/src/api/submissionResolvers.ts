import { AuthService, User } from 'ugrade/auth'
import { Contest, ContestService } from 'ugrade/contest'
import { Language, LanguageService } from 'ugrade/language'
import { Problem } from 'ugrade/problem/problem'
import { ProblemService } from 'ugrade/problem/service'
import { Grading, Submission, SubmissionService } from 'ugrade/submission'
import { AppFieldResolver } from './resolvers'
import { wrap } from './wrap'

export type SubmissionsByContestResolver = AppFieldResolver<Contest, any, Promise<Submission[]>>
export type SubmissionByContestResolver = AppFieldResolver<Contest, { submissionId: string }, Promise<Submission>>
export type UserBySubmissionResolver = AppFieldResolver<Submission, any, Promise<User>>
export type ContestBySubmissionResolver = AppFieldResolver<Submission, any, Promise<Contest>>
export type ProblemBySubmissionResolver = AppFieldResolver<Submission, any, Promise<Problem>>
export type LanguageBySubmissionResolver = AppFieldResolver<Submission, any, Promise<Language>>
export type GradingsBySubmissionResolver = AppFieldResolver<Submission, any, Promise<Grading[]>>
export type CreateSubmissionResolver = AppFieldResolver<
  Contest,
  {
    problemId: string
    languageId: string
    sourceCode: string
  },
  Promise<Submission>
>

export interface SubmissionResolvers {
  Contest: {
    submissions: SubmissionsByContestResolver
    submissionById: SubmissionByContestResolver
  }
  Mutation: {
    createSubmission: CreateSubmissionResolver
  }
  Submission: {
    issuer: UserBySubmissionResolver
    contest: ContestBySubmissionResolver
    gradings: GradingsBySubmissionResolver
    problem: ProblemBySubmissionResolver
    language: LanguageBySubmissionResolver
  }
}

export function createSubmisionsResolver(
  submissionService: SubmissionService,
  authService: AuthService,
  contestService: ContestService,
  problemService: ProblemService,
  languageService: LanguageService
): SubmissionResolvers {
  return {
    Contest: {
      submissions: ({ id }, _args, { authToken }) => wrap(submissionService.getContestSubmissions(authToken, id)),
      submissionById: ({ id }, { submissionId }, { authToken }) =>
        wrap(submissionService.getContestSubmissionById(authToken, id, submissionId)),
    },
    Mutation: {
      createSubmission: (_source, { problemId, languageId, sourceCode }, { authToken }) =>
        wrap(submissionService.createSubmission(authToken, problemId, languageId, sourceCode)),
    },
    Submission: {
      issuer: ({ issuerId }) => wrap(authService.getUserById(issuerId)),
      contest: ({ contestId }) => wrap(contestService.getContestById(contestId)),
      gradings: ({ gradings }) => Promise.resolve(gradings),
      problem: ({ contestId, problemId }, _args, { authToken }) =>
        problemService.getContestProblemById(authToken, contestId, problemId),
      language: ({ languageId }) => wrap(languageService.getLanguageById(languageId)),
    },
  }
}
