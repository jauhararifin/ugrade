import { Announcement } from './Announcement'
import { Clarification } from './Clarification'
import { Contest } from './Contest'
import { Scoreboard } from './Scoreboard'
import { Submission } from './Submission'

export type AnnouncementSubscribeCallback = (
  announcements: Announcement[]
) => any

export type AnnouncementUbsubscribeFunction = () => any

export type ProblemIdsSubscribeCallback = (problemIds: string[]) => any

export type ProblemIdsUnsubscribeFunction = () => any

export type ClarificationSubscribeCallback = (
  clarifications: Clarification[]
) => any

export type ClarificationUnsubscribeFunction = () => any

export type SubmissionSubscribeCallback = (submissions: Submission[]) => any

export type SubmissionUnsubscribeFunction = () => any

export interface ContestService {
  getMyContest(token: string): Promise<Contest>

  getAnnouncements(token: string): Promise<Announcement[]>

  subscribeAnnouncements(
    token: string,
    callback: AnnouncementSubscribeCallback
  ): AnnouncementUbsubscribeFunction

  readAnnouncements(token: string, id: string[]): Promise<void>

  getProblemIds(token: string): Promise<number[]>

  subscribeProblemIds(
    token: string,
    callback: ProblemIdsSubscribeCallback
  ): ProblemIdsUnsubscribeFunction

  getClarifications(token: string): Promise<Clarification[]>

  subscribeClarifications(
    token: string,
    callback: ClarificationSubscribeCallback
  ): Promise<ClarificationUnsubscribeFunction>

  createClarification(
    token: string,
    title: string,
    subject: string,
    content: string
  ): Promise<Clarification>

  createClarificationEntry(
    token: string,
    clarificationId: string,
    content: string
  ): Promise<Clarification>

  readClarificationEntries(
    token: string,
    clarificationId: string,
    entryIds: string[]
  ): Promise<Clarification>

  getSubmissions(token: string): Promise<Submission[]>

  subscribeSubmissions(
    token: string,
    callback: SubmissionSubscribeCallback
  ): Promise<SubmissionUnsubscribeFunction>

  submitSolution(
    token: string,
    problemId: string,
    languageId: string,
    sourceCode: string
  ): Promise<Submission>

  getScoreboard(token: string): Promise<Scoreboard>
}
