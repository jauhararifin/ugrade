import { AuthService, User } from 'ugrade/auth'
import { Contest, ContestService } from 'ugrade/contest'
import { Problem, ProblemType } from 'ugrade/problem/problem'
import { ProblemService } from 'ugrade/problem/service'
import { AppFieldResolver } from './resolvers'
import { wrap } from './wrap'

export type ProblemsByContestResolver = AppFieldResolver<Contest, any, Promise<Problem[]>>

export type ProblemByContestResolver = AppFieldResolver<Contest, { problemId: string }, Promise<Problem>>

export type CreateProblemResolver = AppFieldResolver<
  any,
  {
    shortId: string
    name: string
    statement: string
    type: ProblemType
    disabled: boolean
    timeLimit: number
    tolerance: number
    memoryLimit: number
    outputLimit: number
  },
  Promise<Problem>
>

export type UpdateProblemResolver = AppFieldResolver<
  any,
  {
    problemId: string
    name: string
    statement: string
    type: ProblemType
    disabled: boolean
    order: number
    timeLimit: number
    tolerance: number
    memoryLimit: number
    outputLimit: number
  },
  Promise<Problem>
>

export type DeleteProblemResolver = AppFieldResolver<any, { problemId: string }, Promise<Problem>>

export type ContestByProblemResolver = AppFieldResolver<Problem, any, Promise<Contest>>

export type UserByProblemResolver = AppFieldResolver<Problem, any, Promise<User>>

export interface ProblemResolvers {
  Contest: {
    problems: ProblemsByContestResolver
    problemById: ProblemByContestResolver
  }
  Mutation: {
    createProblem: CreateProblemResolver
    updateProblem: UpdateProblemResolver
    deleteProblem: DeleteProblemResolver
  }
  Problem: {
    contest: ContestByProblemResolver
    issuer: UserByProblemResolver
  }
}

export function createProblemResolvers(
  problemService: ProblemService,
  authService: AuthService,
  contestService: ContestService
): ProblemResolvers {
  return {
    Contest: {
      problems: ({ id }, _args, { authToken }) => wrap(problemService.getContestProblems(authToken, id)),
      problemById: ({ id }, { problemId }, { authToken }) =>
        wrap(problemService.getContestProblemById(authToken, id, problemId)),
    },
    Mutation: {
      createProblem: (
        _source,
        { shortId, name, statement, type, disabled, timeLimit, tolerance, memoryLimit, outputLimit },
        { authToken }
      ) =>
        wrap(
          problemService.createProblem(
            authToken,
            shortId,
            name,
            statement,
            type,
            disabled,
            timeLimit,
            tolerance,
            memoryLimit,
            outputLimit
          )
        ),
      updateProblem: (
        _source,
        { problemId, name, statement, type, disabled, order, timeLimit, tolerance, memoryLimit, outputLimit },
        { authToken }
      ) =>
        wrap(
          problemService.updateProblem(
            authToken,
            problemId,
            name,
            statement,
            type,
            disabled,
            order,
            timeLimit,
            tolerance,
            memoryLimit,
            outputLimit
          )
        ),
      deleteProblem: (_source, { problemId }, { authToken }) =>
        wrap(problemService.deleteProblem(authToken, problemId)),
    },
    Problem: {
      contest: ({ contestId }) => wrap(contestService.getContestById(contestId)),
      issuer: ({ issuerId }) => wrap(authService.getUserById(issuerId)),
    },
  }
}
