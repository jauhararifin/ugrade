import { User } from 'ugrade/services/auth'
import { Announcement } from './Announcement'
import { Clarification } from './Clarification'
import { Contest, Language } from './Contest'
import { Scoreboard } from './Scoreboard'
import { Submission } from './Submission'

export type SubscriptionCallback<T> = (newItem: T) => any
export type UnsubscriptionFunction = () => any

export interface ContestService {
  getAvailableLanguages(): Promise<Language[]>

  getContestByShortId(shortId: string): Promise<Contest>

  getMyContest(token: string): Promise<Contest>

  subscribeMyContest(
    token: string,
    callback: SubscriptionCallback<Contest>
  ): Promise<UnsubscriptionFunction>

  getAnnouncements(token: string): Promise<Announcement[]>

  subscribeAnnouncements(
    token: string,
    callback: SubscriptionCallback<Announcement[]>
  ): Promise<UnsubscriptionFunction>

  readAnnouncements(token: string, id: string[]): Promise<void>

  getProblemIds(token: string): Promise<string[]>

  subscribeProblemIds(
    token: string,
    callback: SubscriptionCallback<string[]>
  ): Promise<UnsubscriptionFunction>

  getClarifications(token: string): Promise<Clarification[]>

  subscribeClarifications(
    token: string,
    callback: SubscriptionCallback<Clarification[]>
  ): Promise<UnsubscriptionFunction>

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
    callback: SubscriptionCallback<Submission[]>
  ): Promise<UnsubscriptionFunction>

  submitSolution(
    token: string,
    problemId: string,
    languageId: string,
    sourceCode: string
  ): Promise<Submission>

  getScoreboard(token: string): Promise<Scoreboard>

  createContest(
    email: string,
    shortId: string,
    name: string,
    shortDescription: string,
    description: string,
    startTime: Date,
    finishTime: Date,
    permittedLanguages?: string[]
  ): Promise<[Contest, User]>
}
