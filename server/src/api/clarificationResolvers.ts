import { AppFieldResolver } from './resolvers'
import {
  Clarification,
  ClarificationEntry,
  ClarificationService,
} from 'ugrade/clarification'
import { User, AuthService } from 'ugrade/auth'
import { Contest, ContestService } from 'ugrade/contest'
import { wrap } from './wrap'

export type CreateClarificationResolver = AppFieldResolver<
  any,
  { title: string; subject: string; content: string },
  Promise<Clarification>
>

export type ReplyClarificationResolver = AppFieldResolver<
  any,
  { clarificationId: string; content: string },
  Promise<ClarificationEntry>
>

export type ReadClarificationEntryResolver = AppFieldResolver<
  any,
  { clarificationEntryId: string },
  Promise<ClarificationEntry>
>

export type ClarificationsByContestResolver = AppFieldResolver<
  Contest,
  any,
  Promise<Clarification[]>
>

export type UserByClarificationResolver = AppFieldResolver<
  Clarification,
  any,
  Promise<User>
>

export type ContestByClarificationResolver = AppFieldResolver<
  Clarification,
  any,
  Promise<Contest>
>

export type EntryByClarificationResolver = AppFieldResolver<
  Clarification,
  any,
  Promise<ClarificationEntry[]>
>

export type UserByEntryResolver = AppFieldResolver<
  ClarificationEntry,
  any,
  Promise<User>
>

export type ClarificationByEntryResolver = AppFieldResolver<
  ClarificationEntry,
  any,
  Promise<Clarification>
>

export interface ClarificationResolvers {
  Contest: {
    clarifications: ClarificationsByContestResolver
  }
  Clarification: {
    issuer: UserByClarificationResolver
    contest: ContestByClarificationResolver
    entries: EntryByClarificationResolver
  }
  ClarificationEntry: {
    sender: UserByEntryResolver
    clarification: ClarificationByEntryResolver
  }
  Mutation: {
    createClarification: CreateClarificationResolver
    replyClarification: ReplyClarificationResolver
    readClarificationEntry: ReadClarificationEntryResolver
  }
}

export const createClarificationResolvers = (
  clarificationService: ClarificationService,
  authService: AuthService,
  contestService: ContestService
): ClarificationResolvers => ({
  Contest: {
    clarifications: ({ id }, _args, { authToken }) =>
      wrap(clarificationService.getContestClarifications(authToken, id)),
  },
  Clarification: {
    issuer: ({ issuerId }) => wrap(authService.getUserById(issuerId)),
    contest: ({ contestId }) => wrap(contestService.getContestById(contestId)),
    entries: ({ id }, _args, { authToken }) =>
      wrap(clarificationService.getClarificationEntries(authToken, id)),
  },
  ClarificationEntry: {
    sender: ({ senderId }) => wrap(authService.getUserById(senderId)),
    clarification: ({ clarificationId }, _args, { authToken }) =>
      wrap(
        clarificationService.getClarificationById(authToken, clarificationId)
      ),
  },
  Mutation: {
    createClarification: (
      _source,
      { title, subject, content },
      { authToken }
    ) =>
      wrap(
        clarificationService.createClarification(
          authToken,
          title,
          subject,
          content
        )
      ),
    replyClarification: (
      _source,
      { clarificationId, content },
      { authToken }
    ) =>
      wrap(
        clarificationService.replyClarification(
          authToken,
          clarificationId,
          content
        )
      ),
    readClarificationEntry: (
      _source,
      { clarificationEntryId },
      { authToken }
    ) =>
      wrap(
        clarificationService.readClarificationEntry(
          authToken,
          clarificationEntryId
        )
      ),
  },
})
