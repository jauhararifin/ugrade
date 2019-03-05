import { User } from 'ugrade/services/auth'
import { Announcement } from './Announcement'
import { Clarification } from './Clarification'
import { Contest, Language } from './Contest'
import { Scoreboard } from './Scoreboard'
import { Submission } from './Submission'

export type SubscriptionCallback<T> = (newItem: T) => any
export type UnsubscriptionFunction = () => any

export interface ContestService {
  /**
   * Get all available languages that supported by ugrade system.
   * @returns List of Language that supported by ugrade.
   */
  getAvailableLanguages(): Promise<Language[]>

  /**
   * Get contest information by it's short id. Short id is used by user to
   * identify a contest. Short id is a unique identifier for contest that human
   * friendly.
   * @param shortId Short id of contest.
   * @returns Contest information
   */
  getContestByShortId(shortId: string): Promise<Contest>

  /**
   * Get user's contest by their token. Every authenticated user have a token
   * that identifies their session. This returns user's current contest info.
   * @param token User's session token
   * @returns User's curent contest
   */
  getMyContest(token: string): Promise<Contest>

  /**
   * Update contest information. To do this, user's need `info:update`
   * permission.
   * @param token User's session token to identify contest
   * @param name Contest name, Ignored when the value is undefined
   * @param shortDescription Contest short description, Short description will
   * shows in the login page after choose contest. Ignored when the value is
   * undefined
   * @param description Contest description. This contains markdown string that
   * describe the contest, may contains contest rule, price, etc.
   * @param startTime Contest start time, contest is considered started when
   * the current time is between `startTime` and `finishTime`
   * @param freezed Is contest freezed. When the contest freezed, scoreboard
   * will not updated when a user submit solutions.
   * @param finishTime Contest finish time, contest is considered started when
   * the current time is between `startTime` and `finishTime`. After finish,
   * contestant cannot submit solution.
   * @param permittedLanguages Contest permitted languages. All languages that
   * permitted to be used in the contest.
   * @returns The new contest information after updated
   */
  updateContestInfo(
    token: string,
    name?: string,
    shortDescription?: string,
    description?: string,
    startTime?: Date,
    freezed?: boolean,
    finishTime?: Date,
    permittedLanguages?: Language[]
  ): Promise<Contest>

  subscribeMyContest(
    token: string,
    callback: SubscriptionCallback<Contest>
  ): UnsubscriptionFunction

  getAnnouncements(token: string): Promise<Announcement[]>

  createAnnouncement(
    token: string,
    title: string,
    content: string
  ): Promise<Announcement>

  subscribeAnnouncements(
    token: string,
    callback: SubscriptionCallback<Announcement[]>
  ): UnsubscriptionFunction

  readAnnouncements(token: string, id: string[]): Promise<void>

  getProblemIds(token: string): Promise<string[]>

  subscribeProblemIds(
    token: string,
    callback: SubscriptionCallback<string[]>
  ): UnsubscriptionFunction

  getClarifications(token: string): Promise<Clarification[]>

  subscribeClarifications(
    token: string,
    callback: SubscriptionCallback<Clarification[]>
  ): UnsubscriptionFunction

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
  ): UnsubscriptionFunction

  submitSolution(
    token: string,
    problemId: string,
    languageId: string,
    sourceCode: string
  ): Promise<Submission>

  getScoreboard(token: string): Promise<Scoreboard>

  subscribeScoreboard(
    token: string,
    callback: SubscriptionCallback<Scoreboard>
  ): UnsubscriptionFunction

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
